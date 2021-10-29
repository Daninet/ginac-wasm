docker build -f cln/Dockerfile . --tag=cln-builder
docker run -it -v %cd%/cln:/output cln-builder cp -R /builder/dist /output

docker build -f ginac/Dockerfile . --tag=ginac-builder
docker run -it -v %cd%/ginac:/output ginac-builder cp -R /builder/dist /output

docker build -f src/Dockerfile . --tag=ginac-binding-builder
docker run -it -v %cd%:/output ginac-binding-builder cp -R /builder/dist /output
