# Dataset Script Tools
This directory contains a number of tools to handle datasets with `bash`. It is far to be complete, the aim is to fast handle large dataset and apply basic operations like split, sorting, shuffling, normalizing, count classes, etc. 


# How to use the Bash Tools
## Count classes
To count different class labels in a csv or tsv dataset file. 
The syntax is `count_classes.sh LABEL_COLUMN DATASET_FILE COLUMN_SEPARATOR`

```bash
$ ./count_classes.sh 1 ../examples/data/sms.tsv "\t"
1	ham	1002
2	spam	322
```

## Count lines
It simply count the lines of a dataset list of files.
The syntax is `count_lines.sh DATASET_FILE[*]`

```bash
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
./sort.sh 1 ../examples/data/sms.tsv ./sms_sorted.tsv "t"
```

## Split Train and Test files
The syntax is `split.sh DATASET_FILE DEST_FOLDER SPLIT_RATIO`


```bash
$ ./split.sh ../examples/data/sms.tsv . 70
Dataset:sms.tsv ratio:70
Training set:./sms_train.tsv
Test set:./sms_test.tsv
$ wc -l < ./sms_test.tsv 
     926
$ wc -l < ./sms_train.tsv 
     398
```

## Normalize
To normalize the rows of a dataset file use the syntax `normalize.sh INPUT_DATASET_FILE OUTPUT_DATASET_FILE`

```bash
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
