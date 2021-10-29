FROM emscripten/emsdk:2.0.32

WORKDIR /builder

ADD ./cln/dist /builder/dist
RUN apt-get update && apt-get install -y pkg-config

RUN wget https://www.ginac.de/ginac-1.8.1.tar.bz2
RUN tar xmf ginac-1.8.1.tar.bz2
RUN mkdir -p lib/ginac && mv ginac-1.8.1/* lib/ginac

ENV CFLAGS="-O3 -fexceptions"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
ENV CPPFLAGS="${CFLAGS}"
ENV LDFLAGS="${CFLAGS}"

RUN emconfigure lib/ginac/configure --host none --prefix /builder/dist PKG_CONFIG_PATH="/builder/dist/lib/pkgconfig"
RUN make -j6 install
