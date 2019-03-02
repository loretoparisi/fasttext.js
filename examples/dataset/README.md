# Example Datasets
We host some example datasets in order to train, test and predict FastText models on the fly.
To download the toy dataset please run

```bash
./dataset.sh
```

The datasets will be copied in the `examples/datasets` folder:

```
.
├── README.md
├── cooking_dataset.tsv
├── dataset.sh
├── email_dataset.tsv
└── sms_dataset.tsv
```

## Split Train and Test files
The syntax is `split.sh DATASET_FILE DEST_FOLDER SPLIT_RATIO`


```bash
cd script/
./split.sh ../examples/dataset/cooking_dataset.tsv ../examples/dataset 70
Dataset:cooking_dataset.tsv ratio: 70%
Training set:../examples/dataset/cooking_dataset_train.tsv samples: 10782
Test set:../examples/dataset/cooking_dataset_test.tsv samnples: 4622
```

You will now see for the chosen dataset file an additional train and a test file
```
.
├── cooking_dataset.tsv
├── cooking_dataset_test.tsv
├── cooking_dataset_train.tsv
```

## Count classes
To count different class labels in a csv or tsv dataset file. 
The syntax is `count_classes.sh LABEL_COLUMN DATASET_FILE COLUMN_SEPARATOR`

```bash
cd script/
$ ./count_classes.sh 1 ../examples/data/sms.tsv "\t"
1	ham	1002
2	spam	322
```

## Count lines
It simply count the lines of a dataset list of files.
The syntax is `count_lines.sh DATASET_FILE[*]`

```bash
cd script/
$ ./count_lines.sh ../examples/data/sms_train.tsv 
1059	../examples/data/sms_train.tsv
```

For multiple files, please use a placeholder:

```bash
$ ./count_lines.sh "../examples/data/sms*"
1324	../examples/data/sms.tsv
265	../examples/data/sms_test.tsv
1059	../examples/data/sms_train.tsv
2648	total
```

## Sorting
To sort a dataset file
The syntax is `sort.sh LABEL_COLUMN INPUT_DATASET_FILE OUTPUT_DATASET_FILE COLUMN_SEPARATOR`

```bash
cd script/
./sort.sh 1 ../examples/data/sms.tsv ./sms_sorted.tsv "t"
```

## Normalize
To normalize the rows of a dataset file use the syntax `normalize.sh INPUT_DATASET_FILE OUTPUT_DATASET_FILE`

```bash
cd script/
$ ./normalize.sh ./sms_train.tsv ./sms_train_norm.tsv 

[loretoparisi@:mbploreto script]$ head -n5 sms_train.tsv 
spam	Urgent! call 09061749602 from Landline. Your complimentary 4* Tenerife Holiday or ?10
spam	+449071512431 URGENT! This is the 2nd attempt to contact U!U have WON ?1250 CALL 09071512433 b4 050703 T&CsBCM4235WC1N3XX. callcost 150ppm mobilesvary. max?7. 50
spam	FREE for 1st week! No1 Nokia tone 4 ur mob every week just txt NOKIA to 8007 Get txting and tell ur mates www.getzed.co.uk POBox 36504 W45WQ norm150p/tone 16+
spam	Urgent! call 09066612661 from landline. Your complementary 4* Tenerife Holiday or ?10
spam	WINNER!! As a valued network customer you have been selected to receivea ?900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.

[loretoparisi@:mbploreto script]$ head -n5 sms_train_norm.tsv 
spam	urgent ! call 09061749602 from landline . your complimentary 4* tenerife holiday or ?10
spam	+449071512431 urgent ! this is the 2nd attempt to contact u ! u have won ?1250 call 09071512433 b4 050703 t&csbcm4235wc1n3xx . callcost 150ppm mobilesvary . max?7 . 50
spam	free for 1st week ! no1 nokia tone 4 ur mob every week just txt nokia to 8007 get txting and tell ur mates www . getzed . co . uk pobox 36504 w45wq norm150p/tone 16+
spam	urgent ! call 09066612661 from landline . your complementary 4* tenerife holiday or ?10
spam	winner ! ! as a valued network customer you have been selected to receivea ?900 prize reward ! to claim call 09061701461 . claim code kl341 . valid 12 hours only . 
```


## Shuffle
To randomly shuffle the rows a dataset file use the syntax `shuffle.sh INPUT_DATASET_FILE OUTPUT_DATASET_FILE`

```bash
$ ./shuffle.sh ./sms_train.tsv ./sms_train_s.tsv

[loretoparisi@:mbploreto script]$ head -n5 sms_train.tsv 
spam	Urgent! call 09061749602 from Landline. Your complimentary 4* Tenerife Holiday or ?10
spam	+449071512431 URGENT! This is the 2nd attempt to contact U!U have WON ?1250 CALL 09071512433 b4 050703 T&CsBCM4235WC1N3XX. callcost 150ppm mobilesvary. max?7. 50
spam	FREE for 1st week! No1 Nokia tone 4 ur mob every week just txt NOKIA to 8007 Get txting and tell ur mates www.getzed.co.uk POBox 36504 W45WQ norm150p/tone 16+
spam	Urgent! call 09066612661 from landline. Your complementary 4* Tenerife Holiday or ?10
spam	WINNER!! As a valued network customer you have been selected to receivea ?900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.

[loretoparisi@:mbploreto script]$ head -n5 sms_train_s.tsv 
ham	Hi this is yijue
ham	Huh i cant thk of more oredi how many pages do we have?
ham	G.W.R
ham	Up to ?... ? wan come then come lor... But i din c any stripes skirt...
ham	Oh oh... Den muz change plan liao... Go back have to yan jiu again...
```
