# fasttext.js
FastText for Node.js

## What is FastText
[FastText](https://github.com/facebookresearch/fastText) is a library for efficient learning of word representations and sentence classification. FastText is provided by Facebook Inc.

## What is FastText.js
`FastText.js` is a `JavaScript` library  that wraps `FastText` to run smoothly within `node`.

## FastText.js APIs
This version of `FastText.js` comes with the following `JavaScript` APIs

```
FastText.new(options)
FastText.load
FastText.train
FastText.test
FastText.predict(string)
FastText.quantize
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

## Predict (inference)
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

### Quantize
To compress (to quantize) a already built model file you call the `FastText.quantize` API. You need to specify the model load path as `loadModel` and the file to be serialized as quantized model in `serializeTo`. Note that `serializeTo` does not need to have the file extension in. A `ftz` extension for the quantized model will be automatically added.

```javascript
var fastText = new FastText({
    debug: true,
    loadModel: './band_model.bin', // must specifiy filename and ext
    serializeTo: './band_model' // do not specify ext: 'ftz' will be added
});
fastText.quantize()
.then(done=> {
    console.log("quantize done.");
})
.catch(error => {
    console.error("quantize error",error);
})
```

## How to Run the Examples
A folder `examples` contains several usage examples of `FastText.js`.
### Train example

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

### Test example

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

### Predict example

```
$ cd examples/
$ node predict.js 
TEXT: our twitter run by the band and crew to give you an inside look into our lives on the road .  get #futurehearts now  http //smarturl . it/futurehearts PREDICT: BAND
TEXT: lbi software provides precisely engineered ,  customer-focused #hrtech solutions .  our flagship solution ,  lbi hr helpdesk ,  is a saas #hr case management product .  PREDICT: ORGANIZATION
```

### Quantize example

```
$ cd examples/
$ node quantize.js 
quantize [ 'quantize',
  '-input',
  './data/band_model.bin',
  '-output',
  './data/band_model' ]
exec:fasttext end.
exec:fasttext exit.
quantize done.
task:fasttext pid:42866 terminated due to receipt of signal:null
```


## Training set and Test set format
The `trainFile` and `testFile` are a TSV or CSV file where the fist column is the label, the second column is the text sample. `FastText.js` will try to normalize the dataset to the `FastText` format using `FastText.prepareDataset` method. You do not have to call this method explicitly by the way, `FastText.js` will do for you. For more info see [here](https://github.com/facebookresearch/fastText#text-classification).

## How It Works
In this release `FastText.js` comes with precompiled binaries for `linux`, `macOS` and `Windows` that run `FastText` natively. A node `child_process` spawn will fork a new `FastText` native process tu run at OS speed, manage the state, the errors and the output of the process to the JavaScript API.

## Disclaimer
For more info about `FastText` and `FastText` license see [here](https://github.com/facebookresearch/fastText).
