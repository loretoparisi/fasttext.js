#!/bin/bash
# @author Loreto Parisi loretoparisi@gmail.com
# @2017-2018 Loreto Parisi loretoparisi@gmail.com

# to handle illegal byte sequence
export LC_CTYPE=C

DATASET=$1
MODEL=$2
COLS=$3
NORM=$4
PLOT=$5

ROOT=$TMPDIR
PLATFORM=$(uname)

if [[ "$PLATFORM" == 'Linux' ]]; then
   BIN=../lib/bin/linux/fasttext
   ROOT="{${TMPDIR:-$(dirname $(mktemp))/}"
elif [[ "$PLATFORM" == 'Darwin' ]]; then
   BIN=../lib/bin/darwin/fasttext
   ROOT=$TMPDIR
fi

[ -z "$BIN" ] && { echo "Uh-oh. Platform not supported"; exit 1; }
[ -z "$1" ] && { echo "Usage: $0 DATASET_FILE MODEL_FILE [LABEL_COLUMS, def:1] [LABEL_NORMALIZED, default|normalize, def:default] [PLOT, 0|1, def:0]"; exit 1; }

echo Platform is $PLATFORM
if [ -z "$NORM" ]; then
NORM='default'
fi
if [ "$NORM" == 'default' ]; then
echo Normalized $DATASET
cp $DATASET ${ROOT}norm
else
echo Normalizing dataset $DATASET...
awk 'BEGIN{FS=OFS="\t"}{ $1 = "__label__" tolower($1) }1' $DATASET > ${ROOT}norm
fi

if [ -z "$COLS" ]; then
COLS=1
fi
echo Splitting $COLS label colums...
cut -f -$COLS -d$'\t' ${ROOT}norm > ${ROOT}normlabels

echo Calculating predictions...
$BIN predict $MODEL $DATASET $COLS > ${ROOT}pexp

if [ -z "$PLOT" ]; then
PLOT=0
fi

echo Calculating confusion matrix...
./confusion.py ${ROOT}normlabels ${ROOT}pexp $PLOT

