import { MESSAGE_TYPE } from './utils/constants'

/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('data: ', request)
  if (request.messageType === MESSAGE_TYPE.IMPORT_MNEMONIC) {
    // call import mnemonic method
  }
});
