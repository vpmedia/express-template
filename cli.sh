#!/usr/bin/env bash
# CLI Project Helper
# Copyright (c) 2023-present VPMedia
# author: Andras Csizmadia <andras@vpmedia.hu>

set -e

task_help() {
  echo "-h or --help = Show this help"
  echo "--clean = Clean the project"
  echo "--init = Initialize the project after checkout"
  echo "--ci = Install npm packages for CI"
  echo "--update = Update npm packages"
  echo "--docker = Run docker container"
  echo "--start = Run the project in development mode"
  echo "--build = Build the project for production"
  echo "--test = Test the project"
  echo "--lint = Lint the project sources"
  echo "--format = Format the project sources"
  echo "--typecheck = Type check the project sources"
}

task_clean() {
  rm -rf ./build
}

task_init() {
  npm install
}

task_ci() {
  npm ci --no-audit
}

task_update() {
  npm update --save
}

task_docker() {
  docker compose kill
  docker compose up --build
}

task_start() {
  npm run start
}

task_build() {
  npm run build
}

task_test() {
  npm run test
}

task_lint() {
  npm run lint
}

task_format() {
  npm run format
}

task_typecheck() {
  npm run typecheck
}

case "$1" in
  -h|--help)
  task_help "$2"
  ;;
  --clean)
  task_clean
  ;;
  --init)
  task_init
  ;;
  --ci)
  task_ci
  ;;
  --update)
  task_update
  ;;
  --docker)
  task_docker
  ;;
  --start)
  task_start
  ;;
  --build)
  task_build
  ;;
  --test)
  task_test
  ;;
  --lint)
  task_lint
  ;;
  --format)
  task_format
  ;;
  --typecheck)
  task_typecheck
  ;;
 *)
  task_help
  ;;
esac
