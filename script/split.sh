#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#
DS=$1
fname="${DS%%.*}"
ext="${DS#*.}"

echo Dataset:$DS
split -l $[ $(wc -l $DS | awk '{print $1}') * 80 / 100] $DS

DS_TRAIN="${fname}_train.$ext"
DS_TEST="${fname}_test.$ext"

mv xaa $DS_TRAIN
mv xab $DS_TEST
echo Training set:$DS_TRAIN
echo Test set:$DS_TEST
