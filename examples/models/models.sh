#!/bin/bash
#
# FastText Tools
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
# @2019 Loreto Parisi (loretoparisi at gmail dot com)
#

GREP_CMD=grep
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
if [ "${OS}" = "darwin" ]; then 
GREP_CMD=pcregrep
fi

DATADIR=./

MODEL=(
    lid.176.ftz
    #ft_lid176_model.bin # full language id model (>100MB)
)

ID=(
    1_520BoBCOkyezPEp14YMBfle5D5i74M0 # language id quantized model
    #1e-7shq4IUP7AScu58uXeQrghr1pUHN76 # full language id model (>100MB)
)

# drive small files direct download
for i in {0..0}
do
  echo "Downloading model ${MODEL[i]}"
  if [ ! -f "${DATADIR}/${MODEL[i]}" ]
  then
    curl -L  "https://drive.google.com/uc?export=download&id=${ID[i]}" > "${DATADIR}/${MODEL[i]}"
  fi
done

# drive bigger files (>10MB) requires intermezzo
# for i in {2..3}
# do
#   echo "Downloading dataset ${DATASET[i]}"
#   if [ ! -f "${DATADIR}/${DATASET[i]}" ]
#   then
#     curl -c /tmp/cookies "https://drive.google.com/uc?export=download&id=${ID[i]}" > /tmp/intermezzo.html
#     echo "---->" $(cat /tmp/intermezzo.html | $GREP_CMD -o 'uc-download-link" [^>]* href="\K[^"]*' | sed 's/\&amp;/\&/g')
#     curl -L -b /tmp/cookies "https://drive.google.com$(cat /tmp/intermezzo.html | $GREP_CMD -o 'uc-download-link" [^>]* href="\K[^"]*' | sed 's/\&amp;/\&/g')" > "${DATADIR}/${DATASET[i]}"
#   fi
# done
