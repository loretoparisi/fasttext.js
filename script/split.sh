#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#

DS=$1
DEST=$2
PERC=$3

if [ -z '$PERC' ]; then
PERC=80
fi

filename=$(basename "$DS")
ext="${filename##*.}"
fname="${filename%.*}"

DS_TRAIN="${fname}_train.$ext"
DS_TEST="${fname}_test.$ext"

echo Dataset:$fname.$ext ratio:$PERC

split -l $[ $(wc -l $DS | awk '{print $1}') * ${PERC} / 100] $DS


mv xaa $DEST/$DS_TRAIN
mv xab $DEST/$DS_TEST
echo Training set:$DEST/$DS_TRAIN
echo Test set:$DEST/$DS_TEST
