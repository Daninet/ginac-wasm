#!/bin/sh
set -e

# set working directory to script location
cd "${0%/*}"

docker build -f src/Dockerfile . --tag=ginac-binding-builder
docker run --rm -v $(pwd):/output ginac-binding-builder cp -R /builder/dist /output
