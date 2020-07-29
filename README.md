# Synapse Extension

An extension wallet for Nervos CKB.

| Service  | Master                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travis   | [![Build Status](https://travis-ci.com/rebase-network/synapse-extension.svg?branch=master)](https://travis-ci.com/rebase-network/synapse-extension)        |
| Coverage | [![codecov](https://codecov.io/gh/rebase-network/synapse-extension/branch/master/graph/badge.svg)](https://codecov.io/gh/rebase-network/synapse-extension) |

[![License](https://img.shields.io/github/license/rebase-network/synapse-extension)](./LICENSE)

## Building

1. `git clone git@github.com:rebase-network/synapse-extension.git`
   or
   `git clone https://github.com/rebase-network/synapse-extension.git`
2. `yarn`
3. `cp .env.example .env`
4. `yarn dev` to compile once or `yarn watch` to run the dev task in watch mode
5. `yarn build` to build a production (minified) version
6. `yarn test` to run test

## Lint

We use eslint, Please install the following extensions in your vscode:

- ESLint
- Prettier
- EditorConfig

## How to install

### Installation for developer

1. Complete the steps to build the project above
2. Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3. With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo

### Installation for non-developer

1. Download the latest released zip file: https://github.com/rebase-network/synapse-extension/releases

2. Uncompress synapse-extension.zip, you will get a folder named `synapse-extension`

3. Open Chrome `chrome://extensions/`, enable `Developer mode`

4. Click `Load unpacked` button, select `synapse-extension` folder

5. You will see synapse extension icon on you tool bar
