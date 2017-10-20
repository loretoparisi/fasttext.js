## What is FastText and FastText.js
[FastText](https://github.com/facebookresearch/fastText) is a library for efficient learning of word representations and sentence classification. FastText is provided by Facebook Inc. 
`FastText.js` is a `JavaScript` library  that wraps `FastText` to run smoothly within `node`.

## FastText.js APIs
This version of `FastText.js` comes with the following `JavaScript` APIs

```
FastText.new(options)
FastText.load
FastText.train
FastText.test
FastText.predict(string)
```

## How to Install

```
git clone https://github.com/loretoparisi/fasttext.js.git
cd fasttext.js
npm install
```

## How to Use

### Train
To train the model you must specificy the training set as `trainFile` and the file where the model must be serialized as `serializeTo`. All the `FastText` supervised options are supported. See [here](https://github.com/facebookresearch/fastText#full-documentation) for more details about training options. Note that `serializeTo` does not need to have the file extension in. A `bin` extension for the quantized model will be automatically added.

```javascript
var fastText = new FastText({
    serializeTo: './band_model',
    trainFile: './band_train.txt'
});

fastText.train()
.then(done=> {
    console.log("train done.");
})
.catch(error => {
    console.error(error);
})
```

### Test
To test your model you must specificy the test set file as `testFile` and the model file to be loaded as `loadModel`. Optionally you can specificy the precision and recall at `k` (P@k and R@k) passing the object `test: { precisionRecall: k }`.
```javascript
var fastText = new FastText({
    loadModel: './band_model.bin',
    testFile:  './band_test.txt'
});

fastText.test()
.then(done=> {
    console.log("test done.");
})
.catch(error => {
    console.error(error);
})
```

## Predict
To inference your model with new data and predict the label you must specify the model file to be loaded as `loadModel`. You can then call the `load` method once, and `predict(string)` to classify a string. Optionally you can specify the `k` most likely labels to print for each line as `predict: { precisionRecall: k }`

```javascript
var sample="Our Twitter run by the band and crew to give you an inside look into our lives on the road. Get #FutureHearts now: http://smarturl.it/futurehearts";
fastText.load()
.then(done => {
    return fastText.predict(sample);
})
.then(labels=> {
    console.log("TEXT:", sample, "\nPREDICT:",labels );
    sample="LBi Software provides precisely engineered, customer-focused #HRTECH solutions. Our flagship solution, LBi HR HelpDesk, is a SaaS #HR Case Management product.";
    return fastText.predict(sample);
})
.then(labels=> {
    console.log("TEXT:", sample, "\nPREDICT:",labels );
    fastText.unload();
})
.catch(error => {
    console.error(error);
});
```

## Examples
A folder `examples` contains several usage examples of `FastText.js`.
### Train

```
$ cd examples/
$ node train.js 
train [ 'supervised',
  '-input',
  '/var/folders/_b/szqwdfn979n4fdg7f2j875_r0000gn/T/trainfile.csv',
  '-output',
  './data/band_model',
  '-dim',
  10,
  '-lr',
  0.1,
  '-wordNgrams',
  2,
  '-minCount',
  1,
  '-bucket',
  10000000,
  '-epoch',
  5,
  '-thread',
  4 ]
Read 0M words
Number of words:  517
Number of labels: 2
Progress: 100.0%  words/sec/thread: 1853435  lr: 0.000000  loss: 0.681683  eta: 0h0m -14m 
exec:fasttext end.
exec:fasttext exit.
train done.
task:fasttext pid:41311 terminated due to receipt of signal:null
```

### Test

```
$ cd examples/
$ node test.js 
test [ 'test',
  './data/band_model.bin',
  '/var/folders/_b/szqwdfn979n4fdg7f2j875_r0000gn/T/trainfile.csv',
  1 ]
Number of examples: 18
exec:fasttext end.
exec:fasttext exit.
test done.
task:fasttext pid:41321 terminated due to receipt of signal:null
```

### Predict

```
$ cd examples/
$ node predict.js 
TEXT: our twitter run by the band and crew to give you an inside look into our lives on the road .  get #futurehearts now  http //smarturl . it/futurehearts PREDICT: BAND
TEXT: lbi software provides precisely engineered ,  customer-focused #hrtech solutions .  our flagship solution ,  lbi hr helpdesk ,  is a saas #hr case management product .  PREDICT: ORGANIZATION
```

### Run a Prediction Server
To run the model and serve predictions via a simple node `http` api

```
$ cd examples/
$ node server.js 
model loaded
server is listening on 3000
```

Try this simple server api passing a `text` parameter like:

http://localhost:3000/?text=LBi%20Software%20provides%20precisely%20engineered,%20customer-focused%20#HRTECH

http://localhost:3000/?text=Our%20Twitter%20run%20by%20the%20band%20and%20crew%20to%20give%20you%20an%20inside%20look%20into%20our%20lives%20on%20the%20road.%20Get%20#FutureHearts

The server api will response in json format

```
{
	response_time: 0.001,
	predict: [{
			label: "BAND",
			score: "0.5"
		},
		{
			label: "ORGANIZATION",
			score: "0.498047"
		}
	]
}
```

## Language Identificaton Server
In this example we use the fastText compressed languages model (176 languages) availalble in the full version [here](https://fasttext.cc/docs/en/language-identification.html)

```
cd examples/
export MODEL=./data/lid.176.ftz 
export PORT=9001
node server
```

and then 

http://localhost:9001/?text=%EB%9E%84%EB%9E%84%EB%9D%BC%20%EC%B0%A8%EC%B0%A8%EC%B0%A8%20%EB%9E%84%EB%9E%84%EB%9D%BC\n%EB%9E%84%EB%9E%84%EB%9D%BC%20%EC%B0%A8%EC%B0%A8%EC%B0%A8%20%EC%9E%A5%EC%9C%A4%EC%A0%95%20%ED%8A%B8%EC%9C%84%EC%8A%A4%ED%8A%B8%20%EC%B6%A4%EC%9D%84%20%EC%B6%A5%EC%8B%9C%EB%8B%A4

that will be correctly detected as KO:

```json
{
	"response_time": 0.001,
	"predict": [{
			"label": "KO",
			"score": "1"
		},
		{
			"label": "TR",
			"score": "1.95313E-08"
		}
	]
}
```


## Training set and Test set format
The `trainFile` and `testFile` are a TSV or CSV file where the fist column is the label, the second column is the text sample. `FastText.js` will try to normalize the dataset to the `FastText` format using `FastText.prepareDataset` method. You do not have to call this method explicitly by the way, `FastText.js` will do for you. For more info see [here](https://github.com/facebookresearch/fastText#text-classification).

## Supported Platforms
In this release `FastText.js` comes with precompiled binaries for `linux`, `macOS` and `Windows` in the `lib/bin/` folder. The Windows version is a 64-bit compiled version. It requires the [Visual C++ Redistributable for Visual Studio 2015](http://www.microsoft.com/en-us/download/details.aspx?id=48145) components. See [here](http://cs.mcgill.ca/~mxia3/FastText-for-Windows/) for more info about the Windows version.

## How It Works
Precompiled binaries runs `FastText` natively. A node `child_process` spawn will fork a new `FastText` native process tu run at OS speed, manage the state, the errors and the output of the process to the JavaScript API.

## Disclaimer
For more info about `FastText` and `FastText` license see [here](https://github.com/facebookresearch/fastText).
