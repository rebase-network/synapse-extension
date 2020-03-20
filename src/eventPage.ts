/**
 * Retrieves opened tabs list
 * @param {Function} callback
 */
function getOpenedTabs(callback) {
    var params = {
        windowId: chrome.windows.WINDOW_ID_CURRENT
    };
    chrome.tabs.query(params, callback);
}

/**
 * Updates browserAction badge
 * @param {Array} tabs
 */
function updateBadge(tabs) {
    chrome.browserAction.setBadgeText({
        text: String(tabs.length)
    });
}

/**
 * Listen messages from popup
 */
chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
    if (data === 'get-tabs') {
        getOpenedTabs(sendResponse);
        return true;
    }
});

/**
 * listen to new tab creation and update badge counter
 */
chrome.tabs.onCreated.addListener(function () {
    getOpenedTabs(updateBadge);
});

/**
 * listen tab onRemoved and update badge counter
 */
chrome.tabs.onRemoved.addListener(function () {
    getOpenedTabs(updateBadge);
});

/**
 * update badge counter on startup
 */
getOpenedTabs(updateBadge);