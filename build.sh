#
# FastText CPU Build Script
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2016 Loreto Parisi (loretoparisi at gmail dot com)
#

IMAGE=fasttext.js
docker build -f Dockerfile -t $IMAGE .