#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#
COL=$1
FILE=$2
SEP=$3
awk -v col="$COL" -F $"$SEP" '   {c[$col]++}
                 END{
                     p=1; for (i in c) { printf("%s'$SEP'%s'$SEP'%s\n",p,i,c[i]);p++ }
                 }' $FILE
