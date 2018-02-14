#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#
WHICH=$1

find $WHICH -maxdepth 1 -type f -print0 | xargs -0 wc | awk '{print $1 "\t" $4}'