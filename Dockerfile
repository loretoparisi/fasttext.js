#
# @author Loreto Parisi (loretoparisi at gmail dot com)
# v1.0.0
#
# Copyright (c) 2017 Loreto Parisi - https://github.com/loretoparisi/docker
#
FROM ubuntu:16.04

MAINTAINER Loreto Parisi <loretoparisi@gmail.com>

# working directory
ENV HOME /root
ENV NODE_VERSION lts
WORKDIR $HOME

# packages list
RUN \
	apt-get update && apt-get install -y \
    curl \
    git \
    npm

# node.js
RUN npm install n -g
RUN n $NODE_VERSION
RUN npm update

# fasttext.js
RUN git clone https://github.com/loretoparisi/fasttext.js
    
CMD ["bash"]
