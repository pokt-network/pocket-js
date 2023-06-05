protoc --plugin=../../../node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=generated ./tx-signer.proto --ts_proto_opt=esModuleInterop=true

# when running this gen file import * as _m0 from "protobufjs/minimal" causes import bugs and does not result in same import pattern as previous releases.
# This commit here shows that potentially it was manually added (https://github.com/pokt-foundation/pocket-js/commit/00e85a5c0b6a20ced85a3df7a12bb25004d691a9#diff-ecd6dda6a974a6196f2d4d4681856ae6668c31a4f0a45a0d06b8cb2c74739273R8)
# Not sure how modify gen script to result in same import, so the below statements will replace import * as _m0 from "protobufjs/minimal" to import _m0 from "protobufjs/minimal"
file_paths=(
  "generated/tx-signer.ts"
  "generated/google/protobuf/any.ts"
)

# Perform the import replacement for each file path using a for loop
for file_path in "${file_paths[@]}"; do
  sed -i 's/import \* as _m0 from '\''protobufjs\/minimal'\''/import _m0 from '\''protobufjs\/minimal'\''/' "$file_path"
done