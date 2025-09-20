#!/bin/bash
emcc -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s USE_ES6_IMPORT_META=1 \
  -s ENVIRONMENT='web' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","HEAP8", "HEAPU8", "HEAP16", "HEAPU16", "HEAP32", "HEAPU32", "HEAPF32", "HEAPF64"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORT_NAME='createSnes9xModule' \
  -s WASM_ASYNC_COMPILATION=1 \
  source/*.c \
  -o snes9x_2005.js