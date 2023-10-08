# Copyright (c) 2023-present VPMedia
# author: Andras Csizmadia <andras@vpmedia.hu>
# see https://docs.docker.com/engine/reference/builder/

FROM ubuntu:22.04

LABEL author="Andras Csizmadia <andras@vpmedia.hu>"

RUN apt update && apt install -y \
  apt-utils \
  apt-transport-https \
  ca-certificates \
  software-properties-common \
  build-essential \
  curl

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt update && apt install -y nodejs

ENV NODE_ENV development

WORKDIR /usr/local/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "./cli.sh", "--start" ]
