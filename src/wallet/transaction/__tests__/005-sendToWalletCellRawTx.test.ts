import { BN } from 'bn.js';
import { addressToScript } from '@keyper/specs';
import { getUnspentCells } from '../../../utils/apis';
import { configService } from '../../../config';
const CKB = require('@nervosnetwork/ckb-sdk-core').default;
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils/lib';
import { bobAddresses, walletCellAddresses } from '../../../test/fixture/address';
import { anypayDep } from '../../../test/fixture/deps';

describe('Anypay Wallet', () => {
  const ckb = new CKB('http://127.0.0.1:8114');

  it('create anypay wallet', async () => {
    const privateKey = '0x0c7197eb7b24c870344bf5bacae96842c9092ba6da2373f43168cdd2b6d97d72';
    const fromAddress = 'ckt1qyqtcahqdff3j0fukt7save3yd7tqg07884qceg6n0';
    const rawTx = {
        "version": "0x0",
        "cellDeps": [
          {
            "depType": "depGroup",
            "outPoint": {
              "txHash": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
              "index": "0x0"
            }
          },
          {
            "depType": "code",
            "outPoint": {
              "txHash": "0x9b08d3645320e5915c8682e591f36f951dc14a733bdaa58a5e6ccefdb9c4b5b0",
              "index": "0x0"
            }
          }
        ],
        "headerDeps": [],
        "inputs": [
          {
            "since": "0x0",
            "previousOutput": {
              "txHash": "0xef7e089ba381ad4eecd64565cc739278032e84baa011d8d559394e5cadd8b898",
              "index": "0x1"
            }
          },
          {
            "since": "0x0",
            "previousOutput": {
              "txHash": "0xef7e089ba381ad4eecd64565cc739278032e84baa011d8d559394e5cadd8b898",
              "index": "0x0"
            }
          }
        ],
        "outputs": [
          {
            "capacity": "0xb0f387b00",
            "lock": {
              "hashType": "data",
              "codeHash": "0x0fb343953ee78c9986b091defb6252154e0bb51044fd2879fde5b27314506111",
              "args": "0xcf0c34ac8af4a2c7861b33640ecc9af4e8d338f1"
            },
            "type": null
          },
          {
            "capacity": "0x22ecb25c00",
            "lock": {
              "hashType": "type",
              "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
              "args": "0xbc76e06a53193d3cb2fd0eb331237cb021fe39ea"
            },
            "type": null
          }
        ],
        "outputsData": [
          "0x",
          "0x"
        ],
        "witnesses": [
          {
            "lock": "",
            "inputType": "",
            "outputType": ""
          },
          "0x"
        ]
      };      
    // const signedTx = ckb.signTransaction(privateKey)(rawTx);

    // console.log('signedTx =>', JSON.stringify(signedTx));
    const signedTx2 = {
        "version": "0x0",
        "cellDeps": [
          {
            "depType": "depGroup",
            "outPoint": {
              "txHash": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
              "index": "0x0"
            }
          },
          {
            "depType": "code",
            "outPoint": {
              "txHash": "0x9b08d3645320e5915c8682e591f36f951dc14a733bdaa58a5e6ccefdb9c4b5b0",
              "index": "0x0"
            }
          }
        ],
        "headerDeps": [],
        "inputs": [
          {
            "since": "0x0",
            "previousOutput": {
              "txHash": "0xef7e089ba381ad4eecd64565cc739278032e84baa011d8d559394e5cadd8b898",
              "index": "0x1"
            }
          },
          {
            "since": "0x0",
            "previousOutput": {
              "txHash": "0xef7e089ba381ad4eecd64565cc739278032e84baa011d8d559394e5cadd8b898",
              "index": "0x0"
            }
          }
        ],
        "outputs": [
          {
            "capacity": "0xb0f387b00",
            "lock": {
              "hashType": "data",
              "codeHash": "0x0fb343953ee78c9986b091defb6252154e0bb51044fd2879fde5b27314506111",
              "args": "0xcf0c34ac8af4a2c7861b33640ecc9af4e8d338f1"
            },
            "type": null
          },
          {
            "capacity": "0x22ecb25c00",
            "lock": {
              "hashType": "type",
              "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
              "args": "0xbc76e06a53193d3cb2fd0eb331237cb021fe39ea"
            },
            "type": null
          }
        ],
        "outputsData": [
          "0x",
          "0x"
        ],
        "witnesses": [
          "0x55000000100000005500000055000000410000004c18a8bc16a6403a5e600e9e23c106382f5cdfe8110733dccb7138979cda7dbc14e7fd2350cfa9f7414eb548094fa62bd5de344fd180bae57aeadfcc145eaf4300",
          "0x"
        ]
      };
    const realTxHash = await ckb.rpc.sendTransaction(signedTx2);
    console.log('realTxHash =>', JSON.stringify(realTxHash));
  });
});
