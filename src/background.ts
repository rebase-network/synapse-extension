import { MESSAGE_TYPE, KEYSTORE_TYPE } from './utils/constants'
import { mnemonicToSeedSync, validateMnemonic } from './wallet/mnemonic';

import {generateMnemonic} from './wallet/key';
import Keystore from './wallet/keystore';
import Keychain from './wallet/keychain';

import { AccountExtendedPublicKey, ExtendedPrivateKey } from "./wallet/key";
import { AddressType, AddressPrefix } from './wallet/address';
import {getBalanceByPublicKey, getBalanceByLockHash} from './balance';
import {sendSimpleTransaction} from './sendSimpleTransaction';
import {getAmountByTxHash, getStatusByTxHash,getFeeByTxHash, getInputAddressByTxHash, getOutputAddressByTxHash, getOutputAddressByTxHashAndIndex} from './transaction';
import {getPrivateKeyByKeyStoreAndPassword} from './wallet/exportPrivateKey'

/**
 * Listen messages from popup
 */

let wallets = []
let currWallet = {}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

  //IMPORT_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    const confirmPassword = request.confirmPassword.trim();

    if (password != confirmPassword) {
      // TODO
      // return err
    }

    //助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);
    console.log(isValidateMnemonic)
    if(!isValidateMnemonic){
      console.log('isValidateMnemonic: ', "Not a ValidateMnemonic");
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    // TODO
    // words 是否在助记词表中

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )

    const keystore = Keystore.create(extendedKey, password);
    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
      accountKeychain.publicKey.toString('hex'),
      accountKeychain.chainCode.toString('hex'),
    )

    // 判断 AddressPrefix Mainnet=>Testnet
    const addrTestnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Testnet);
    const addrMainnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);

    const wallet = {
      "path": addrMainnet.path,
      "blake160": addrMainnet.getBlake160(),
      "mainnetAddr": addrMainnet.address,
      "testnetAddr": addrTestnet.address,
      "lockHash": addrMainnet.getLockHash(),
      "rootKeystore": keystore.toJson(),
      "keystore":"",
      "keystoreType": KEYSTORE_TYPE.MNEMONIC_TO_KEYSTORE
  }

    wallets.push(wallet)

    currWallet = wallet
    currWallet['index'] = wallets.length-1

    chrome.storage.sync.set({ wallets,}, () => {
      console.log('wallets is set to storage: ' + JSON.stringify(wallets));
    });

    chrome.storage.sync.set({ currWallet,}, () => {
      console.log('currWallet is set to storage: ' + JSON.stringify(currWallet));
    });

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS)
  }

  //GEN_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.GEN_MNEMONIC) {
    const newmnemonic = generateMnemonic()

    chrome.runtime.sendMessage({
      mnemonic: newmnemonic,
      messageType: MESSAGE_TYPE.RECE_MNEMONIC
    })
  }

  //SAVE_MNEMONIC
  if (request.messageType === MESSAGE_TYPE.SAVE_MNEMONIC) {
    const mnemonic = request.mnemonic.trim();
    const password = request.password.trim();
    const confirmPassword = request.confirmPassword.trim();

    if (password != confirmPassword) {
      // TODO
      // return err
    }

    //助记词有效性的验证
    const isValidateMnemonic = validateMnemonic(mnemonic);

    if (!isValidateMnemonic) {
      console.log('isValidateMnemonic: ', "Not a ValidateMnemonic");
      chrome.runtime.sendMessage(MESSAGE_TYPE.IS_NOT_VALIDATE_MNEMONIC);
      return;
    }

    const seed = mnemonicToSeedSync(mnemonic)
    const masterKeychain = Keychain.fromSeed(seed)

    const extendedKey = new ExtendedPrivateKey(
      masterKeychain.privateKey.toString('hex'),
      masterKeychain.chainCode.toString('hex')
    )

    const keystore = Keystore.create(extendedKey, password);
    const accountKeychain = masterKeychain.derivePath(AccountExtendedPublicKey.ckbAccountPath);

    const accountExtendedPublicKey = new AccountExtendedPublicKey(
      accountKeychain.publicKey.toString('hex'),
      accountKeychain.chainCode.toString('hex'),
    )

    const addrTestnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Testnet);
    const addrMainnet = accountExtendedPublicKey.address(AddressType.Receiving, 0, AddressPrefix.Mainnet);

    const wallet = {
      keystore: keystore.toJson(),
      testnet: {
        address: addrTestnet.address,
        path: addrTestnet.path,
        pubKey: addrTestnet.publicKey
      },
      mainnet: {
        address: addrMainnet.address,
        path: addrMainnet.path,
        pubKey: addrMainnet.publicKey
      },
    }

    chrome.storage.sync.set({ wallet,}, () => {
      console.log('wallet is set to storage: ' + JSON.stringify(wallet));
    });

    chrome.runtime.sendMessage(MESSAGE_TYPE.VALIDATE_PASS)
  }

  //REQUEST_ADDRESS_INFO
  if (request.messageType === MESSAGE_TYPE.REQUEST_ADDRESS_INFO) {
    chrome.storage.sync.get(['currWallet'], function(wallet) {
      console.log('Wallet is ' + JSON.stringify(wallet));

      const message: any = {
        messageType: MESSAGE_TYPE.ADDRESS_INFO
      }
      if (wallet) {
        message.address = {
          testnet: wallet.currWallet.testnetAddr,
          mainnet: wallet.currWallet.mainnetAddr,
        }
      }
      console.log('message: ', message);

      chrome.runtime.sendMessage(message)
    });
  }

  // get balance by address
  if (request.messageType === MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS) {
    chrome.storage.sync.get(['currWallet'], async function(wallet) {

      let balance = ""
      if (wallet) {
        console.log("address - lockhash =>",wallet["currWallet"]["lockHash"]);
        //0x906b0e6ff58afe7d4b56c795399b56600cc890d1eef60ffbbaa9d2c95727bdf1
        const capacityAll = await getBalanceByLockHash(wallet["currWallet"]["lockHash"]);
        balance = capacityAll.toString()
      }

      chrome.runtime.sendMessage({
        balance,
        messageType: MESSAGE_TYPE.BALANCE_BY_ADDRESS
      })
    });
  }

  //发送交易
  if (request.messageType === MESSAGE_TYPE.RESQUEST_SEND_TX) {

    chrome.storage.sync.get(['currWallet'], async function( wallet ) {

      //1- 从chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.SEND_TX })获取values的值
      const toAddress = request.address.trim();
      const amount = request.amount.trim();
      const fee = request.fee.trim();
      const password = request.password.trim();
      const network = request.network.trim();

      //keystore ===>masterKeychain
      console.log("wallet SendTx =>", wallet);

      let privateKey = "";
      if(wallet.currWallet.keystoreType === KEYSTORE_TYPE.MNEMONIC_TO_KEYSTORE
         || wallet.currWallet.keystoreType === KEYSTORE_TYPE.KEYSTORE_TO_KEYSTORE){
          
          const keystore =  Keystore.fromJson(JSON.stringify(wallet.currWallet.rootKeystore)); //参数是String
          const masterPrivateKey = keystore.extendedPrivateKey(password)
          
          console.log("masterPrivateKey =>", masterPrivateKey);
    
          const masterKeychain = new Keychain(
            Buffer.from(masterPrivateKey.privateKey, 'hex'),
            Buffer.from(masterPrivateKey.chainCode, 'hex'),
          )
          privateKey = '0x' + masterKeychain.derivePath(wallet.currWallet.path).privateKey.toString('hex')
          console.log();

      //PrivateKey导入的情况还未解决      
      } else if(wallet.currWallet.keystoreType == KEYSTORE_TYPE.PRIVATEKEY_TO_KEYSTORE){
          console.log("Export privateKey");
      }

      let fromAddress = "";
      if(network === "testnet") {
          fromAddress = wallet.currWallet.testnetAddr;
      } else if (network === "mainnet") {
          fromAddress = wallet.currWallet.mainnetAddr;
      }

      const sendTxHash = await sendSimpleTransaction(
                                  privateKey,
                                  fromAddress,
                                  toAddress,
                                  BigInt(amount),
                                  BigInt(fee));

      console.log("sendTxHash=>", sendTxHash);
  
      chrome.runtime.sendMessage({
        fromAddress: fromAddress,
        toAddress: toAddress,
        amount: amount.toString(),
        fee: fee.toString(),
        txHash:sendTxHash,
        messageType: MESSAGE_TYPE.TO_TX_DETAIL
      })
    });
  }

//tx-detail
if (request.messageType === MESSAGE_TYPE.REQUEST_TX_DETAIL) {
  // chrome.storage.sync.get(['wallet'], async function( {wallet} ) {

      const txHash = request.message.txHash;
      const amount = request.message.amount;
      const fee = request.message.fee;
      const inputs = request.message.fromAddress;
      const outputs = request.message.toAddress;
      // 测试用数据
      // const txhash = "0xb95121d9e0947cdabfd63025c00a285657fd40e6bc69215c63f723a5247c8ead";
      // const address = "ckt1qyqr79tnk3pp34xp92gerxjc4p3mus2690psf0dd70";
      //001-status
      const status = await getStatusByTxHash(txHash);
      //002-amount

      // const amount = await getAmountByTxHash(txhash,address);
      // const tradeAmount = new Number(amount);
      // console.log(tradeAmount);
      //003-fee
      // const fee = await getFeeByTxHash(txhash);
      // const tradeFee = new Number(fee);
      // console.log(fee.toString());
      //004-inputs
      // const inputs = await getInputAddressByTxHash(txhash);
      //005-outputs
      // const outputs = await getOutputAddressByTxHash(txhash);

      chrome.runtime.sendMessage({
        status,
        tradeAmount: amount,
        fee,
        inputs,
        outputs,
        txHash,
        messageType: MESSAGE_TYPE.TX_DETAIL
      })
  // });
  }

  //export-private-key check
  if(request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK){
    chrome.storage.sync.get(['currWallet'], function({ wallet }) {

      const password = request.password;
      const keystore = Keystore.fromJson(JSON.stringify(wallet.keystore)); //参数是String
      //check the password by keystore
      const checkPassword = keystore.checkPassword(password);

      //send the check result to the page
      if(!checkPassword){
        chrome.runtime.sendMessage({
          isValidatePassword:checkPassword,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT
        })
      }

      console.log("keystore=>",JSON.stringify(wallet.keystore));

      // valiate -> get Keystore and privateKey
      const privateKey = getPrivateKeyByKeyStoreAndPassword(JSON.stringify(wallet.keystore),password);

        chrome.runtime.sendMessage({
          isValidatePassword:checkPassword,
          keystore: keystore,
          privateKey: privateKey,
          messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_CHECK_RESULT
        })

    });
  }

  //export-private-key-second check
  if(request.messageType === MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND){

      const privateKey = request.message.privateKey;
      const keystore = request.message.keystore;

      chrome.runtime.sendMessage({
        privateKey,
        keystore: JSON.stringify(keystore),
        messageType: MESSAGE_TYPE.EXPORT_PRIVATE_KEY_SECOND_RESULT
      })
  }

});
