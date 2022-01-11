#!/bin/sh

set -xe

cd $(git rev-parse --show-toplevel)
mkdir -p dist

zip dist/ext.zip icons/* *.js *.json LICENSE
