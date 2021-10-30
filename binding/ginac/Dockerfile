FROM emscripten/emsdk:2.0.32

WORKDIR /builder

RUN apt-get update && apt-get install -y pkg-config

RUN wget https://www.ginac.de/ginac-1.8.1.tar.bz2 && \
  tar xmf ginac-1.8.1.tar.bz2 && \
  mkdir -p lib/ginac && mv ginac-1.8.1/* lib/ginac

ENV CFLAGS="-O3 -Oz -flto -fexceptions"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
ENV CPPFLAGS="${CFLAGS}"
ENV LDFLAGS="${CFLAGS}"

ADD ./cln/dist /builder/dist

RUN emconfigure lib/ginac/configure --host none --prefix /builder/dist PKG_CONFIG_PATH="/builder/dist/lib/pkgconfig"
RUN make -j6 install
