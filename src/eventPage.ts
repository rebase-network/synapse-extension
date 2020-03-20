
/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('data: ', request)
});
