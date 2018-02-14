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
sort -k$COL -nr $INFILE > $OUTFILE