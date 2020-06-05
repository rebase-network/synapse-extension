#! /bin/bash

rm -rf dist synapse-extension

yarn build

mv dist synapse-extension

# 打包压缩
zip -q -r synapse-extension.zip synapse-extension

rm -rf dist

# 文件的校验和
shasum synapse-extension.zip
