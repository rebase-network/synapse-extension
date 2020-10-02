# Synapse Extension

An extension wallet for Nervos CKB.

| Service  | Master                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travis   | [![Build Status](https://travis-ci.com/rebase-network/synapse-extension.svg?branch=master)](https://travis-ci.com/rebase-network/synapse-extension)        |
| Coverage | [![codecov](https://codecov.io/gh/rebase-network/synapse-extension/branch/master/graph/badge.svg)](https://codecov.io/gh/rebase-network/synapse-extension) |

[![License](https://img.shields.io/github/license/rebase-network/synapse-extension)](./LICENSE)


## How to install

### Installation for non-developer

1. Download the latest released zip file: https://github.com/rebase-network/synapse-extension/releases

2. Uncompress synapse-extension.zip, you will get a folder named `synapse-extension`

3. Open Chrome `chrome://extensions/`, enable `Developer mode`

4. Click `Load unpacked` button, select `synapse-extension` folder

5. You will see synapse extension icon on you tool bar

## Development
### Start extension
1. `git clone git@github.com:rebase-network/synapse-extension.git`
   or
   `git clone https://github.com/rebase-network/synapse-extension.git`
2. `yarn`
3. `cp .env.example .env`
4. `yarn watch` to run the dev task in watch mode

Optional: If you want to work with local CKB RPC node, you need to setup a local service to provide cell query service, checkout [ckb-cache-layer](https://github.com/rebase-network/ckb-cache-layer/blob/master/README.md) for the setup instructions.

### Install extension

1. Open Google Chrome and go to [_chrome://extensions_](chrome://extensions)
2. Open Chrome `chrome://extensions/`, enable `Developer mode`
3. Click `Load unpacked` button, select `synapse-extension` folder
4. You will see synapse extension icon on you tool bar

### Testing
`yarn test` to run test

### Lint

We use eslint, Please install the following extensions in your vscode:

- ESLint
- Prettier
- EditorConfig

## Production

`yarn build` to build a production (minified) version

