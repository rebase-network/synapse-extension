#! /bin/bash

rm -rf dist synapse-extension

yarn build

mv dist synapse-extension

zip -q -r synapse-extension.zip synapse-extension

rm -rf dist

# 文件的校验和
shasum -a 256 synapse-extension.zip | tee synapse-extension.asc
