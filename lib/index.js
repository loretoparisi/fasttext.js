/**
 * FastText.js
 * Node.js wrapper for Facebook FastText
 * @see https://github.com/facebookresearch/fastText
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @copyright Copyright (c) 2017 Loreto Parisi
*/

(function () {

    var fs = require('fs'),
        path = require('path'),
        os = require('os'),
        Util = require('./util'),
        Deque = require('./deque');

    var FastText;
    FastText = (function () {

        /**
         * FastText Classifier
         * @see https://github.com/facebookresearch/fastText
         */
        function FastText(options) {
            var self = this;

            this.samplesCallbacks = {};
            this.dataCallbacks = new Deque();
            this.dataErrorCallbacks = new Deque();
            this.onExitCallbacks = new Deque();
            this.dataAppendCallback = null;
            this.onErrorDataAppendCallback = null;

            this._options = {

                bin: '',
                child: {
                    detached: false
                },
                debug: false,
                // true to preprocess dataset file
                preprocess: true,
                trainFile: '',
                testFile: '',
                serializeTo: '',
                loadModel: '',
                train: {
                    //// dictionary opt
                    // max length of word ngram
                    wordNgrams: 2,
                    // minimal number of word occurences
                    minCount: 1,
                    // minimal number of label occurences
                    minCountLabel: 1,
                    // min length of char ngram
                    minn: 3,
                    // max length of char ngram
                    maxn: 6,
                    // sampling threshold
                    t: 0.0001,
                    // number of buckets
                    bucket: 10000000,
                    // labels prefix

                    //// training opt
                    // size of word vectors
                    dim: 10,
                    // learning rate
                    lr: 0.1,
                    // size of the context window
                    ws: 5,
                    // loss function {ns, hs, softmax}
                    loss: 'ns',
                    // change the rate of updates for the learning rate
                    lrUpdateRate: 100,
                    // number of epochs
                    epoch: 5,
                    // number of threads
                    thread: 4
                },
                test: {
                    // precision and recall at k (P@k and R@k)
                    precisionRecall: 1,
                    verbosity: 2
                },
                predict: {
                    // k most likely labels for each line <= labels count
                    mostlikely: 2,
                    verbosity: 2,
                    // true to normalize input text before prediction
                    normalize: true
                }
            };

            const numCPUs = Math.ceil(os.cpus().length / 2);
            this._options.train.thread = numCPUs;
            this._options.bin = Util.GetBinFolder('fasttext');

            Util.mergeRecursive(this._options, options);

            /**
             * Execute child process
             */
            this.exec = function (name, command, params, options) {
                var self = this;
                var _options = { detached: false };
                for (var attrname in options) { _options[attrname] = options[attrname]; }

                var created_time = (new Date()).toISOString();
                var task = require('child_process').spawn(command, params, _options);
                task.stdout.on('data', function (_data) {
                    var data = new Buffer(_data, 'utf-8').toString();
                    // remove empty chunks
                    var chunks = data.split("\n").filter(data => !Util.empty(data));

                    // route chunks to callbacks
                    chunks.forEach(data => {
                        if (self.dataCallbacks && self.dataCallbacks.length > 0) { // shift last data
                            var callback = self.dataCallbacks.shift();
                            if (callback) callback.apply(self, [data]);
                        }
                    });
                    if (self.dataAppendCallback) { // data append
                        self.dataAppendCallback.apply(self, [data]);
                    }
                });
                task.on('error', function (error) {
                    if (self._options.debug) console.error("exec:%s pid:%d error:\n", name, task.pid, error);
                    if (self.dataErrorCallbacks.length > 0) { // shift last error callback
                        var callback = self.dataErrorCallbacks.shift();
                        if (callback) callback.apply(self, [error]);
                    }
                });
                task.on('uncaughtException', function (error) {
                    if (self._options.debug) console.error("exec:%s pid:%s uncaughtException:\n", name, task.pid, error);
                    if (self.dataErrorCallbacks && self.dataErrorCallbacks.length > 0) { // shift last data
                        var callback = self.dataErrorCallbacks.shift();
                        if (callback) callback.apply(self, [error]);
                    }
                });
                task.stdout.on('end', function (data) {
                    if (self._options.debug) console.log("exec:%s end.", name);
                });
                task.stderr.on('data', function (data) {
                    if (self.onErrorDataAppendCallback) { // data append
                        self.onErrorDataAppendCallback.apply(self, [new Buffer(data, 'utf-8').toString()]);
                    }
                });
                task.on('close', (code, signal) => {
                    if (self._options.debug) console.warn('task:%s pid:%s terminated due to receipt of signal:%s', name, task.pid, signal);
                });
                task.on('exit', function (code) {
                    if (self._options.debug) console.log("exec:%s exit.", name);
                    if (code != null && code != 0) {
                        var error = new Error();
                        error.description = command + ' ' + params.join(' ');
                        error.code = code;
                        if (self._options.debug) console.error("exec:%s pid:%d error:\n", name, task.pid, error);
                        task.kill('SIGINT');
                        if (self.onExitCallbacks && self.onExitCallbacks.length > 0) { // shift last data
                            var callback = self.onExitCallbacks.shift();
                            if (callback) callback.apply(self, [error]);
                        }
                    } else {
                        // at exit explicitly kill exited task
                        task.kill('SIGINT');
                        if (self.onExitCallbacks && self.onExitCallbacks.length > 0) { // shift last data
                            var callback = self.onExitCallbacks.shift();
                            if (callback) callback.apply(self, [error]);
                        }
                    }
                });
                return task;
            }//exec

            /**
             * Send data to child process
             */
            this.send = function (data) {
                this.child.stdin.setEncoding('utf-8');
                this.child.stdin.write(data + '\r\n');
            }//send

            /**
             * Send End Of File
             */
            this.sendEOF = function () {
                var EOF = new Buffer(1); EOF[0] = -1;
                this.child.stdin.write(EOF);
            }//sendEOF

            /**
             * Supervised or unsupervised traing
             * @param {*} args 
             */
            this.learn = function (args) {
                var self = this;
                if (!Util.empty(self._options.train)) {
                    for (var k in self._options.train) {
                        var v = self._options.train[k];
                        args.push('-' + k);
                        args.push(v);
                    };
                }
                return new Promise(function (resolve, reject) {
                    self.evaluation = {};

                    // register callbacks
                    var onErrorCallback = function (error) {
                        return reject(error);
                    };
                    var onExitCallback = function (error) {
                        if (error) return reject(error);
                        else return resolve(self.evaluation);
                    }
                    var onErrorDataAppendCallback = function (data) {
                        if (data.indexOf('Progress') > -1) {
                            // Progress: 51.3%  words/sec/thread: 985828  lr: 0.004869  loss: 2.428359  eta: 0h0m 
                            var eval = data.split(/\s/);
                            if (eval && eval.length == 16) {
                                var res = {
                                    progress: parseFloat(eval[2]),
                                    words: parseInt(eval[5]),
                                    lr: parseFloat(eval[8]),
                                    loss: parseFloat(eval[11]),
                                    eta: eval[14]
                                };
                                if (self._options.trainCallback) {
                                    self._options.trainCallback.apply(this, [res]);
                                }
                            }
                        }
                        if (data.indexOf('Number of') > -1) {
                            //Read 38M words
                            //Number of words:  165190
                            //Number of labels: 217
                            var eval = data.split('\n');
                            if (eval && eval.length >= 3) {
                                var W = eval[1].split(':')[1];
                                var L = eval[2].split(':')[1];
                                if (W) {
                                    self.evaluation.W = parseInt(Util.trim(W));
                                }
                                if (L) {
                                    self.evaluation.L = parseInt(Util.trim(L));
                                }
                                if (self._options.debug) console.log(self.evaluation);
                            }
                        }
                    }
                    self.onErrorDataAppendCallback = onErrorDataAppendCallback;
                    self.dataErrorCallbacks.push(onErrorCallback);
                    self.onExitCallbacks.push(onExitCallback);

                    if (self._options.debug) console.log("learn", args);
                    self.child = self.exec('fasttext', self._options.bin, args, self._options.child);
                    if (self._options.debug) {
                        self.child.stderr.pipe(process.stdout);
                        self.child.stdout.pipe(process.stdout);
                    }
                });
            }//learn

        } // FastText

        /**
         * Load model for Probabilities Prediction
         */
        FastText.prototype.load = function () {
            var self = this;
            return new Promise(function (resolve, reject) {

                // register callbacks
                var onErrorCallback = function (error) {
                    return reject(error);
                }
                self.dataErrorCallbacks.push(onErrorCallback);

                var args = [
                    'predict-prob',
                    self._options.loadModel,
                    '-',
                    self._options.predict.mostlikely
                ];

                if (self._options.debug) console.log("load", args);
                self.child = self.exec('fasttext', self._options.bin, args, self._options.child);
                if (self._options.debug) self.child.stdout.pipe(process.stdout);

                self.predict("__")
                    .then(res => {
                        return resolve(true);
                    })
                    .catch(error => {
                        return reject(error);
                    });

            });
        }//load

        /**
         * Load model for Nearest Neighbor
         */
        FastText.prototype.loadnn = function () {
            var self = this;
            return new Promise(function (resolve, reject) {

                // register callbacks
                var onErrorCallback = function (error) {
                    return reject(error);
                }
                self.dataErrorCallbacks.push(onErrorCallback);

                var args = [
                    'nn',
                    self._options.loadModel,
                    self._options.predict.mostlikely
                ];

                if (self._options.debug) console.log("load", args);
                self.child = self.exec('fasttext', self._options.bin, args, self._options.child);
                if (self._options.debug) self.child.stdout.pipe(process.stdout);

                self.predict("")
                    .then(res => {
                        return resolve(true);
                    })
                    .catch(error => {
                        return reject(error);
                    });

            });
        }//loadnn

        /**
         * Unload model from memory
         */
        FastText.prototype.unload = function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (self.child) {
                    self.child.kill('SIGINT');
                    return resolve(true);
                } else return resolve(false);
            });
        }//unload

        /**
         * Predict label
         */
        FastText.prototype.predict = function (data) {
            var self = this;
            return new Promise(function (resolve, reject) {
                // register callbacks
                var onErrorCallback = function (error) {
                    return reject(error);
                };
                var onDataCallback = function (_data) {
                    var data = _data.replace(/__label__(.)/g, "$1").toUpperCase().trim().split(/\s+/g);
                    var probs = [];
                    for (var i = 0; i < data.length - 1; i = i + 2) {
                        probs.push({ label: data[i], score: data[i + 1] });
                    }
                    return resolve(probs);
                }
                var onErrorDataAppendCallback = function (data) {
                    if (self._options.debug) console.log(data);
                }
                self.dataCallbacks.push(onDataCallback);
                self.dataErrorCallbacks.push(onErrorCallback);
                self.onErrorDataAppendCallback = onErrorDataAppendCallback;

                if (self._options.predict.normalize) { // normalize and send
                    return self.send(FastText.normalize(data));
                } else { // send raw
                    self.send(data);
                }
            });
        }//predict

        /**
         * Find Nearest Neighbor Words
         */
        FastText.prototype.nn = function (data) {
            var self = this;
            return new Promise(function (resolve, reject) {

                var res = '';
                // register callbacks
                var onDataCallback = function (_data) {
                    var data = _data.split(/\n/);
                    data = data.slice(0, -1);//remove last
                    var res = [];
                    if (data && data.length) {
                        data.forEach(nearest => {
                            var el = nearest.split(/\s/);
                            if (el && el.length > 1) { // two fields
                                res.push({
                                    word: el[0],
                                    similarity: el[1]
                                });
                            }
                        });
                    }
                    return resolve(res);
                };
                var onDataAppendCallback = function (_data) {
                    res += _data;
                    if (res.indexOf('Query word?') > -1) { // end query
                        return onDataCallback(res);
                    }
                };
                var onErrorDataAppendCallback = function (data) {
                    if (self._options.debug) console.log(data);
                };

                self.dataAppendCallback = onDataCallback;
                self.onErrorDataAppendCallback = onErrorDataAppendCallback;

                if (self._options.predict.normalize) { // normalize and send
                    return self.send(FastText.normalize(data));
                } else { // send raw
                    self.send(data);
                }
            });
        }//nn

        /**
         * Learn words representation
         * @param {*} params 
         */
        FastText.prototype.word2vec = function (params) {
            var self = this;
            return new Promise(function (resolve, reject) {
                self.prepareDataset({ filePath: self._options.trainFile, tmpFilePath: self._options.tmpFilePath })
                    .then(locations => {
                        // fasttext skipgram -input "${DATADIR}/$TRAIN_FILE_OUT" -output "${RESULTDIR}/$RESULTDIR_MODEL" -dim 10 -lr 0.1 -wordNgrams 2 -minCount 1 -bucket 10000000 -epoch 5 -thread 4
                        var args = [
                            self._options.word2vec.model,
                            '-input',
                            locations.outputFile,
                            '-output',
                            self._options.serializeToW2V,
                        ];
                        return self.learn(args);
                    })
                    .then(res => {
                        return resolve(res);
                    })
                    .catch(error => {
                        return reject(error);
                    })
            });
        }//word2vec

        /**
         * Train supervised model
         */
        FastText.prototype.train = function (params) {
            var self = this;
            Util.mergeRecursive(this._options, params);
            return new Promise(function (resolve, reject) {
                self.prepareDataset({ filePath: self._options.trainFile, tmpFilePath: self._options.tmpFilePath })
                    .then(locations => {
                        self.evaluation = {};
                        if (self._options.debug) console.log("train locations", locations);
                        // fasttext supervised -input "${DATADIR}/$TRAIN_FILE_OUT" -output "${RESULTDIR}/$RESULTDIR_MODEL" -dim 10 -lr 0.1 -wordNgrams 2 -minCount 1 -bucket 10000000 -epoch 5 -thread 4
                        var args = [
                            'supervised',
                            '-input',
                            locations.outputFile,
                            '-output',
                            self._options.serializeTo,
                        ];
                        return self.learn(args);
                    })
                    .then(res => {
                        return resolve(res);
                    })
                    .catch(error => {
                        return reject(error);
                    })
            });
        }//train

        /**
         * Test model
         */
        FastText.prototype.test = function (params) {
            var self = this;
            Util.mergeRecursive(this._options, params);
            return new Promise(function (resolve, reject) {
                self.prepareDataset({ filePath: self._options.testFile, tmpFilePath: self._options.tmpFilePath })
                    .then(locations => {

                        var args = [
                            'test',
                            self._options.loadModel,
                            locations.outputFile,
                            self._options.test.precisionRecall,
                        ];
                        if (self._options.debug) console.log("test", args);
                        var data = '';

                        // register callbacks
                        var onErrorCallback = function (error) {
                            return reject(error);
                        };
                        var onDataCallback = function (stdout) {
                            data = data.concat(stdout);
                        }
                        var onExitCallback = function (error) {

                            var res = {};
                            var eval = data.split('\n');
                            if (eval && eval.length >= 3) {
                                var res = {
                                    'N': eval[0].split('\t')[1],
                                    'P': eval[1].split('\t')[1],
                                    'R': eval[2].split('\t')[1]
                                };
                                if (!self.evaluation) self.evaluation = {};
                                self.evaluation.N = res.N;
                                self.evaluation.P = res.P;
                                self.evaluation.R = res.R;
                                if (self._options.debug) console.log(res);
                            }

                            self.dataAppendCallback = null;
                            if (error) return reject(error);
                            else return resolve(self.evaluation);
                        }

                        self.dataAppendCallback = onDataCallback;
                        self.dataErrorCallbacks.push(onErrorCallback);
                        self.onExitCallbacks.push(onExitCallback);

                        self.child = self.exec('fasttext', self._options.bin, args, self._options.child);
                        if (self._options.debug) {
                            self.child.stderr.pipe(process.stdout);
                            self.child.stdout.pipe(process.stdout);
                        }
                    })
                    .catch(error => {
                        return reject(error);
                    })
            });
        }//test

        /**
         * Get dataset labels
         * @return Array
         */
        FastText.prototype.getLabels = function () {
            return this.labels;
        }//getLabels

        /**
         * Preparare dataset
         */
        FastText.prototype.prepareDataset = function (params, callback) {
            var self = this;
            self.labels = [];
            return new Promise(function (resolve, reject) {
                if (!self._options.preprocess) { // dataset preprocessed
                    return resolve({
                        outputFile: params.filePath
                    });
                }
                if (Util.empty(params.tmpFilePath)) { // create temp file
                    params.tmpFilePath = Util.GetTempDir() + path.sep + Util.getUUID() + ".csv";
                }

                var i = fs.openSync(params.filePath, 'r');
                var o = fs.openSync(params.tmpFilePath, 'w');

                var buf = new Buffer(1024 * 1024), len, prev = '';
                while (len = fs.readSync(i, buf, 0, buf.length)) {

                    var a = (prev + buf.toString('utf-8', 0, len)).split('\n');
                    prev = len === buf.length ? '\n' + a.splice(a.length - 1)[0] : '';
                    var out = '';
                    a.forEach(function (text) {
                        if (!text) return;

                        var labels = text.match(/\b__label__(.*?)\b/g);
                        if (labels && labels.length) { // multi-label 
                            labels.forEach(l => {
                                if (self.labels.indexOf(l) < 0) self.labels.push(l);
                            });
                        } else { // single label
                            var label = text.match(/^[^\t]*/gm);
                            if (label && label.length > 0 && self.labels.indexOf(label[0]) < 0) self.labels.push(label[0]);
                        }

                        text = text.toLowerCase();
                        if (text.indexOf('__label__') < 0) text = text.replace(/^/gm, '__label__'); // default prefix if not
                        text = text
                            .replace(/'/g, " ' ")
                            .replace(/"/g, '')
                            //.replace(/\./g, ' \. ') // LP: bug: with 20news labels that has .
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
                    outputFile: params.tmpFilePath
                });
            });
        }//prepareDataset

        /**
         * Normalize test helper
         * @param text string
         * @return string
         */
        FastText.normalize = function (text) {
            // textanalyzer normalization
            text = Util.removeDiacritics(text)
                .toLowerCase()
                .replace(/(?:\\[rn]|[\r\n]+)+/g, " ")
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')
                .replace(/\t+/g, '\t').replace(/\t\s/g, ' ').replace(/\t/g, ' ')
                // fasttext normalization
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
                .replace(/\t+/g, '\t').replace(/\t\s/g, ' ').replace(/\t/g, ' ');
            return text;
        }//normalize

        return FastText;

    })();

    module.exports = FastText;

}).call(this);