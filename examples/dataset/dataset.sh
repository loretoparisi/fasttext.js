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

DATASET=(
    sms_dataset.tsv
    email_dataset.tsv
    cooking_dataset.tsv
)

ID=(
    1lPhBV9FIHzlFVLnm3KGYhZNj84Ck6sic # sms dataset
    1knt0Nid92z5eM9PdIve33G444y9Re7Xc # email dataset
    16LcZXp5lwx8YSDtZT60zV5-xlmaAPSEv # cooking dataset
)

# drive small files direct download
for i in {0..2}
do
  echo "Downloading dataset ${DATASET[i]}"
  if [ ! -f "${DATADIR}/${DATASET[i]}" ]
  then
    curl -L  "https://drive.google.com/uc?export=download&id=${ID[i]}" > "${DATADIR}/${DATASET[i]}"
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
