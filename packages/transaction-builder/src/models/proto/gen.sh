#!/bin/sh

[ -d generated ] && rm -rf generated
mkdir generated

protoc --plugin=../../../node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=generated \
  --ts_proto_opt=esModuleInterop=true \
  --ts_proto_opt=importSuffix=.js \
  ./tx-signer.proto
