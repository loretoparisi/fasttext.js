#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2018 Loreto Parisi (loretoparisi at gmail dot com)
#
myshuf() {
  perl -MList::Util=shuffle -e 'print shuffle(<>);' "$@";
}
cat $1 | myshuf > $2