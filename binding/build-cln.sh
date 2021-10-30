#!/bin/sh
set -e

# set working directory to script location
cd "${0%/*}"

docker build -f cln/Dockerfile . --tag=cln-builder
docker run --rm -v $(pwd)/cln:/output cln-builder cp -R /builder/dist /output
