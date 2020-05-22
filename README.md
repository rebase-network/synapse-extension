<!--
 * @Descripttion:
 * @version:
 * @Author: shooter
 * @Date: 2020-05-22 23:56:00
 * @LastEditors: shooter
 * @LastEditTime: 2020-05-23 00:09:12
-->
# Synapse Extension

A extension wallet and Keyper agency for Nervos CKB

## Building

1. `git clone git@github.com:rebase-network/synapse-extension.git`
   or
   `git clone https://github.com/rebase-network/synapse-extension.git`
2. `yarn`
3. `yarn dev` to compile once or `yarn watch` to run the dev task in watch mode
4. `yarn build` to build a production (minified) version
5. `yarn test` to run test

## Lint

Use [arianacosta/poetic](https://github.com/arianacosta/poetic) to do the lint. Please install the following extensions in your vscode:

- ESLint
- Prettier
- EditorConfig

## How to install

### Installation for developer

1. Complete the steps to build the project above
2. Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3. With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo

### Installation for non-developer

1. Download the zip file: https://github.com/rebase-network/synapse-extension/releases/download/v0.0.1/synapse-extension.zip

2. Uncompress synapse-extension.zip, you will get a folder named `synapse-extension`

3. Open Chrome `chrome://extensions/`, enable `Developer mode`

4. Click `Load unpacked` button, select `synapse-extension` folder

5. You will see synapse extension icon on you tool bar
