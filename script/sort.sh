#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#
COL=$1
INFILE=$2
OUTFILE=$3
SEP=$4

# we set default lang output encoding
# bug: passing $'$SEP' not working
LC_ALL='C' sort -t $'\t' -k$COL -nr $INFILE > $OUTFILE
