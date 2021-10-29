FROM emscripten/emsdk:2.0.32

WORKDIR /builder

ADD ./cln/patch /builder/patch

RUN wget https://www.ginac.de/CLN/cln-1.3.6.tar.bz2
RUN tar xmf cln-1.3.6.tar.bz2
RUN mkdir -p lib/cln && mv cln-1.3.6/* lib/cln

RUN patch lib/cln/include/cln/object.h patch/cl_word_alignment.patch
RUN patch lib/cln/src/timing/cl_t_current2.cc patch/hz.patch

ENV CFLAGS="-O3 -Oz -fexceptions"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
ENV CPPFLAGS="${CFLAGS} -DNO_ASM"
ENV LDFLAGS="${CFLAGS}"

RUN emconfigure lib/cln/configure --host none --prefix /builder/dist --without-gmp
RUN make -j6 install
