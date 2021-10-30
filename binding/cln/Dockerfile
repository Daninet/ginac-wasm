FROM emscripten/emsdk:2.0.32

WORKDIR /builder

RUN wget https://www.ginac.de/CLN/cln-1.3.6.tar.bz2 && \
  tar xmf cln-1.3.6.tar.bz2 && \
  mkdir -p lib/cln && mv cln-1.3.6/* lib/cln

ADD ./cln/patch /builder/patch

RUN patch lib/cln/include/cln/object.h patch/cl_word_alignment.patch && \
  patch lib/cln/src/timing/cl_t_current2.cc patch/hz.patch

ENV CFLAGS="-O3 -Oz -flto -fexceptions"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
ENV CPPFLAGS="${CFLAGS} -DNO_ASM"
ENV LDFLAGS="${CFLAGS}"

RUN emconfigure lib/cln/configure --host none --prefix /builder/dist --without-gmp
RUN make -j6 install
