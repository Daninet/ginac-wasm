#!/bin/sh
set -e

# set working directory to script location
cd "${0%/*}"

docker build -f ginac/Dockerfile . --tag=ginac-builder
docker run -it -v $(pwd)/ginac:/output ginac-builder cp -R /builder/dist /output
