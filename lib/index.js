/**
 * FastText.js
 * Node.js wrapper for Facebook FastText
 * @see https://github.com/facebookresearch/fastText
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

(function() {

var fs = require('fs'),
    Util = require('./util');

var FastText;
FastText = (function() {

/**
 * FastText Classifier
 * @see https://github.com/facebookresearch/fastText
 */
function FastText(options) {
    var self=this;
    
    this._options={

        bin: Util.GetBinFolder(),
        child: {
            detached: false
        },
        debug: false,
        trainFile: '',
        testFile: '',
        serializeTo: '',
        loadModel: '',
        train: {
            dim: 10,
            lr: 0.1,
            wordNgrams: 2,
            minCount: 1,
            bucket: 10000000,
            epoch: 5,
            thread:4
        },
        test: {
            // precision and recall at k (P@k and R@k)
            precisionRecall: 1    
        },
        predict: {
            // k most likely labels for each line <= labels count
            precisionRecall: 2    
        }
    };
    Util.MergeRecursive(this._options, options);

    /**
     * Execute child process
     */
    this.exec = function(name,command,params,options) {
        var self=this;
        var _options = { detached: false };
        for (var attrname in options) { _options[attrname] = options[attrname]; }

        var created_time= ( new Date() ).toISOString();
        var task = require('child_process').spawn(command, params, _options);
        task.stdout.on('data', function(_data) {
            if( self.onDataCallback ) self.onDataCallback.apply(self,[ new Buffer(_data,'utf-8').toString() ] );
        });
        task.on('error', function(error) {
            if(self._options.debug) console.error("exec:%s pid:%d error:\n",name,task.pid,error);
        });
        task.stdout.on('end', function(data) {
            if(self._options.debug) console.log("exec:%s end.",name);
        });
        task.stderr.on('data', function(data) {
            //if(self._options.debug) console.log("exec:%s stderr:%s",name,data);
            //if(!data) task.kill('SIGINT');
        });
        task.on('close', (code, signal) => {
            if(self._options.debug) console.warn('task:%s pid:%s terminated due to receipt of signal:%s',name,task.pid,signal);
        });
        task.on('exit', function(code) {
            if(self._options.debug) console.log("exec:%s exit.",name);
            if (code != 0) {
                var error=new Error();
                error.description= command + ' ' + params.join(' ');
                error.code=code;
                if(self._options.debug) console.error("exec:%s pid:%d error:\n",name,task.pid,error);
                task.kill('SIGINT');
                if( self.onExitCallback ) self.onExitCallback.apply(self,[error]);
            } else {
                // at exit explicitly kill exited task
                task.kill('SIGINT');
                if( self.onExitCallback ) self.onExitCallback.apply(self);
            }
        });
        return task;
    }//exec

    /**
     * Send data to child process
     */
    this.send = function(data) {
        this.child.stdin.setEncoding('utf-8');
        this.child.stdin.write( data + '\r\n' );
    }//send

} // FastText

/**
 * Load model in memory
 * @return Promise
 */
FastText.prototype.load = function() {
    var self=this;
    return new Promise(function(resolve, reject) {
        var args =[
            'predict',
            self._options.loadModel,
            '-',
            self._options.predict.precisionRecall
        ];
        if( self._options.debug) console.log("predict",args);
        self.child=self.exec('fasttext', self._options.bin, args, self._options.child);
        return resolve(true);
        if(self._options.debug) self.child.stdout.pipe(process.stdout);
    });
}//load

/**
 * Unload model from memory
 * @return Promise
 */
FastText.prototype.unload = function() {
    var self=this;
    return new Promise(function(resolve, reject) {
        if(self.child) {
            self.child.stdin.write("\x03");//CTRL-C
            self.child.kill('SIGINT');
            return resolve(true);
        } else return resolve(false);
    });
}//unload

/**
 * Predict label
 * @return Promise
 */
FastText.prototype.predict = function(data) {
    var self=this;
    this.onExitCallback=null;
    this.onDataCallback=null;
    return new Promise(function(resolve, reject) {
        self.onDataCallback = function(data) {
            data=data.replace(/__label__(.)/g,"$1").toUpperCase().trim().split(/\s+/g);
            return resolve(data);
        }
        return self.send(FastText.normalize(data));
    });
}//predict

/**
 * Train model
 * @return Promise
 */
FastText.prototype.train = function() {
    var self=this;
    this.onExitCallback=null;
    this.onDataCallback=null;
    return new Promise(function(resolve, reject) {
        self.prepareDataset({ filePath: self._options.trainFile })
        .then(locations=> {
            // fasttext supervised -input "${DATADIR}/$TRAIN_FILE_OUT" -output "${RESULTDIR}/$RESULTDIR_MODEL" -dim 10 -lr 0.1 -wordNgrams 2 -minCount 1 -bucket 10000000 -epoch 5 -thread 4
            var args=[
                    'supervised',
                    '-input',
                    locations.outputFile,
                    '-output',
                    self._options.serializeTo, 
                    ];
            for (var k in self._options.train) {
                var v=self._options.train[k];
                args.push('-'+k);
                args.push(v);
            };
            self.onExitCallback = function(error) {
                if(error) return reject(error);
                else return resolve(true);
            }
            if( self._options.debug) console.log("train",args);
            self.child=self.exec('fasttext', self._options.bin, args, self._options.child);
            self.child.stderr.pipe(process.stdout);
        })
        .catch(error => {
            return reject(error);
        })
    });
}//train

/**
 * Test model
 * @return Promise
 */
FastText.prototype.test = function() {
    var self=this;
    this.onExitCallback=null;
    this.onDataCallback=null;
    return new Promise(function(resolve, reject) {
        self.prepareDataset({ filePath: self._options.testFile })
        .then(locations=> {
            // fasttext test "${RESULTDIR}/$MODEL" "${DATADIR}/$TEST_FILE_OUT"
            var args=[
                'test',
                self._options.loadModel,
                locations.outputFile,
                self._options.test.precisionRecall,
            ];
            if( self._options.debug) console.log("test",args);
            self.onExitCallback = function(error) {
                if(error) return reject(error);
                else return resolve(true);
            }
            self.child=self.exec('fasttext', self._options.bin, args, self._options.child);
            self.child.stderr.pipe(process.stdout);
        })
        .catch(error => {
            return reject(error);
        })
    });
}//test

/**
 * Compress model to quantized version
 */
FastText.prototype.quantize = function() {
    var self=this;
    this.onExitCallback=null;
    this.onDataCallback=null;
    return new Promise(function(resolve, reject) {
        //  fasttext quantize -input "${RESULTDIR}/$RESULTDIR_MODEL" -output "${RESULTDIR}/$RESULTDIR_MODEL"
        var args=[
            'quantize',
            '-input',
            self._options.loadModel,
            '-output',
            self._options.serializeTo
        ];
        if( self._options.debug) console.log("quantize",args);
        self.onExitCallback = function(error) {
            if(error) return reject(error);
            else return resolve(true);
        }
        self.child=self.exec('fasttext', self._options.bin, args, self._options.child);
        self.child.stderr.pipe(process.stdout);
    });
}//quantize

/**
 * Preparare dataset
 * @see https://github.com/facebookresearch/fastText/blob/master/classification-example.sh#L15
 * @return Promise
 */
FastText.prototype.prepareDataset = function(params,callback) {
    var self=this;
    return new Promise(function(resolve, reject) {
        var tmpFilePath=Util.GetTempDir()+"/fasttexttmp.csv";

        var i = fs.openSync(params.filePath, 'r');
        var o = fs.openSync(tmpFilePath, 'w');

        var buf = new Buffer(1024 * 1024), len, prev = '';

        while(len = fs.readSync(i, buf, 0, buf.length)) {

            var a = (prev + buf.toString('utf-8', 0, len)).split('\n');
            prev = len === buf.length ? '\n' + a.splice(a.length - 1)[0] : '';
            var out = '';
            a.forEach(function(text) {
                if(!text) return;
                text=text.toLowerCase()
                .replace(/^/gm, '__label__')
                .replace(/'/g, " ' ")
                .replace(/"/g, '')
                .replace(/\./g, ' \. ')
                .replace(/,/g, ' \, ')
                .replace(/\(/g, ' ( ')
                .replace(/\)/g, ' ) ')
                .replace(/!/g, ' ! ')
                .replace(/\?/g, ' ! ')
                .replace(/;/g, ' ')
                .replace(/:/g, ' ')
                out += text + '\n';
            });
            var bout = new Buffer(out, 'utf-8');
            fs.writeSync(o, bout, 0, bout.length);
        }

        fs.closeSync(o);
        fs.closeSync(i);

        return resolve({
            outputFile: tmpFilePath
        });
    });
}//prepareDataset

/**
 * Normalize test helper
 * @see https://github.com/facebookresearch/fastText/blob/master/classification-example.sh#L15
 * @param text string
 * @return string
 */
FastText.normalize = function(text) {
    text=text.toLowerCase()
    .replace(/(?:\\[rn]|[\r\n]+)+/g, " ")
    .replace(/'/g, " ' ")
    .replace(/"/g, '')
    .replace(/\./g, ' \. ')
    .replace(/,/g, ' \, ')
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/!/g, ' ! ')
    .replace(/\?/g, ' ! ')
    .replace(/;/g, ' ')
    .replace(/:/g, ' ')
    .replace(/\t+/g,'\t').replace(/\t\s/g,' ').replace(/\t/g,' ');
    return text;
}//normalize

return FastText;

})();

module.exports = FastText;

}).call(this);