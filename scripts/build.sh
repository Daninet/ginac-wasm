#!/bin/bash
set -e

mkdir -p dist
mkdir -p wasm

# npm run eslint

make -f ./Makefile --silent --always-make --output-sync=target -j8 RELEASE=1

node --max-old-space-size=4096 ./node_modules/rollup/dist/bin/rollup -c
npx tsc ./src/index --outDir ./dist --downlevelIteration --declaration --allowSyntheticDefaultImports
