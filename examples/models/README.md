# Example Models
We host some example pretrained models. To download the models please run

```bash
./models.sh
```

The models will be copied in the `examples/models` folder:

```
.
├── lid.176.ftz
└── models.sh
```

## Train a Language Identification Model
To train a language identification model we will use the [tatoeba](https://tatoeba.org/eng/downloads) dataset, a 112MB plain text file.

### Dataset normalization

We first run the `langid_dataset` that will split the sentences dataset into the `lang_train.txt` and `lang_valid.txt` dataset files. The script will also convert the labels into FastText default label format and shuffle the dataset rows.

```bash
cd dataset/
./langid_dataset.sh
./sentences.tar downloading...
Converting to fasttext format...
Splitting into train and test set...
Train set ./lang_train.txt samples: 7392916
Validation set ./lang_valid.txt: 10000
```

### Model training

Now we can run the `train` example, specifying at least the env for `TRAINFILE` for input training set and `SERIALIZETO` for the output model file. Please do not specify the extension, the 'bin' extension will be added automatically:

```bash
export TRAINFILE=dataset/lang_train.txt
export SERIALIZETO=models/langid_model
node train
{ W: 41622, L: 146 }
Read 0M words
Number of words:  41622
Number of labels: 146
train done. { W: 41622, L: 146 }
```

### Model testing

We can now test the model running the `test` script. We have to set the env `TESTFILE` for the input test set, and the `MODEL` file we have trained before:

```bash
export TESTFILE=dataset/lang_valid.txt
echo $SERIALIZETO.bin
models/langid_model.bin
export MODEL=$SERIALIZETO.bin
node test
N	9977
P@1	0.16
R@1	0.16
Number of examples: 9977
exec:fasttext end.
exec:fasttext exit.
{ N: '9977', P: '0.16', R: '0.16' }
test done. { N: '9977', P: '0.16', R: '0.16' }
```

### Model optimization

Of course we must find the good hyperparameters yet:

```bash
export TRAIN_EPOCH=30
export TRAIN_LOSS=softmax
export TRAIN_DIM=100
node train
{ W: 41622, L: 146 }
Read 0M words
Number of words:  41622
Number of labels: 146
train done. { W: 41622, L: 146 }
node test
N	9977
P@1	0.568
R@1	0.568
Number of examples: 9977
exec:fasttext end.
exec:fasttext exit.
{ N: '9977', P: '0.568', R: '0.568' }
test done. { N: '9977', P: '0.568', R: '0.568' }
```

Congrats! We have just improved the model from `0.16` to `0.57`, but we can go further:

```bash
export TRAIN_EPOCH=60
node train
node test
{ N: '9977', P: '0.725', R: '0.725' }
test done. { N: '9977', P: '0.725', R: '0.725' }
```

We now do training and testing in a row using the `traintest` script
```bash
export TRAIN_EPOCH=100
node traintest
{ W: 41622, L: 146 }
Read 0M words
Number of words:  41622
Number of labels: 146
N	9977
P@1	0.816
R@1	0.816
Number of examples: 9977
exec:fasttext end.
exec:fasttext exit.
{ N: '9977', P: '0.816', R: '0.816' }
task:fasttext pid:53612 terminated due to receipt of signal:null
test done. { W: 41622, L: 146, N: '9977', P: '0.816', R: '0.816' }
```

Awesome, our langid model has now a `0.81` precision.

### Labels Testing

We can now check the `F1-Score (F1)`. `Precision (P)` and `Recall (R)` for each label using the `testlabel` script. Please note that we will get a JSON array for each language label:

```bash
node testlabels
[ { eng: { F1: '0.395517', P: '0.246507', R: '1.000000' } },
  { ita: { F1: '0.246686', P: '0.140697', R: '1.000000' } },
  { rus: { F1: '0.561415', P: '0.390255', R: '1.000000' } },
  { tur: { F1: '0.214684', P: '0.120250', R: '1.000000' } },
  { epo: { F1: '0.177578', P: '0.097441', R: '1.000000' } },
  { deu: { F1: '0.182131', P: '0.100189', R: '1.000000' } },
  { fra: { F1: '0.136424', P: '0.073205', R: '1.000000' } },
  { por: { F1: '0.099441', P: '0.052322', R: '1.000000' } },
  { spa: { F1: '0.098406', P: '0.051749', R: '1.000000' } },
  { hun: { F1: '0.066066', P: '0.034161', R: '1.000000' } },
  { heb: { F1: '0.064675', P: '0.033418', R: '1.000000' } },
  { jpn: { F1: '0.074854', P: '0.038882', R: '1.000000' } },
  { ber: { F1: '0.056095', P: '0.028857', R: '1.000000' } },
  { ukr: { F1: '0.054037', P: '0.027769', R: '1.000000' } },
  { pol: { F1: '0.023525', P: '0.011902', R: '1.000000' } },
  { mkd: { F1: '0.038682', P: '0.019722', R: '1.000000' } },
  { nld: { F1: '0.024318', P: '0.012308', R: '1.000000' } },
  { fin: { F1: '0.024525', P: '0.012415', R: '1.000000' } },
  { kab: { F1: '0.016532', P: '0.008335', R: '1.000000' } },
  { cmn: { F1: '0.019754', P: '0.009975', R: '1.000000' } },
  { mar: { F1: '0.015432', P: '0.007776', R: '1.000000' } },
  { dan: { F1: '0.012950', P: '0.006517', R: '1.000000' } },
  { lat: { F1: '0.009987', P: '0.005019', R: '1.000000' } },
  { swe: { F1: '0.010950', P: '0.005505', R: '1.000000' } },
  { ara: { F1: '0.009892', P: '0.004971', R: '1.000000' } },
  { ces: { F1: '0.009557', P: '0.004801', R: '1.000000' } },
  ```

  ### Confusion Matrix
  We can computer the confusion matrix as well. We will pass `1` as value of the `LABEL_COLUMS`, `normalize` as value of the `LABEL_NORMALIZED` parameter and we will not plot the matrix in this case.

  ```bash
  cd tools/
  ./confusion.sh ../examples/dataset/lang_train.txt ../examples/models/langid_model.bin 1 normalize
  ```

  ### Making predictions
  As soon as we are satifisied we our model, we can start making language identification predictions

  ```bash
cd examples/
export MODEL=models/langid_model.bin
node cli
Loading model...
model loaded.
Welcome to FastText.js CLI
Type exit or CTRL-Z to exit
> hello how are you?
> [ { label: 'EN', score: '0.988627' },
  { label: 'BN', score: '0.000935369' } ]
> das is seher gut!
> [ { label: 'DE', score: '0.513201' },
  { label: 'EN', score: '0.411016' } ]
rien ne va plus
> [ { label: 'FR', score: '0.951547' },
  { label: 'EO', score: '0.00760891' } ]
exit
> model unloaded.
  ```