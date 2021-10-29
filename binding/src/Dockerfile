FROM emscripten/emsdk:2.0.32

WORKDIR /builder

ADD ./src /builder/src
ADD ./ginac/dist /builder/dist

ENV CFLAGS="-I/builder/dist/include -O3 -Oz -flto -fexceptions"
ENV CXXFLAGS="${CFLAGS} -std=c++11"
ENV LDFLAGS="-L/builder/dist/lib ${CFLAGS}"

RUN emcc ${CXXFLAGS} -c src/entry.cpp -o src/entry.o
RUN emcc ${LDFLAGS} \
  -s ENVIRONMENT='web,worker,node' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s WARN_UNALIGNED=1 \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -s FILESYSTEM=1 \
  -s ASSERTIONS=1 \
  -s EXPORTED_FUNCTIONS='["_ginac_get_buffer", "_ginac_print", "_ginac_parse_print", "_ginac_set_digits", "_main"]' \
  --emit-symbol-map \
  -lcln -lginac \
  src/entry.o \
  -o /builder/dist/ginac.js
