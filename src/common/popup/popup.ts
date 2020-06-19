/* eslint-disable no-underscore-dangle */

export default class Popup {
  protected _window = undefined;

  protected _windowId: number = undefined;

  protected _tabId: number = undefined;

  constructor(popupWindow) {
    this._window = popupWindow;
    this._windowId = popupWindow?.id;
    this._tabId = popupWindow?.id;
  }

  get windowId() {
    return this._windowId;
  }

  get window() {
    return this._window;
  }

  get tabId() {
    return this._tabId;
  }

  async getTab() {
    const window = await browser.windows.get(this._windowId, { populate: true });
    return window?.tabs?.[0];
  }

  waitTabLoaded() {
    return new Promise((resolve, reject) => {
      let QUERY_LIMIT = 5;
      try {
        const intervalId = setInterval(async () => {
          QUERY_LIMIT -= 1;
          const tab = await this.getTab();
          // status: [loading, complete]
          if (tab?.status === 'complete' || QUERY_LIMIT === 0) {
            clearInterval(intervalId);
            resolve(tab);
          }
        }, 2000);
      } catch (error) {
        reject(error);
      }
    });
  }

  async update(updateInfo) {
    this._window = await browser.windows.update(this._windowId, updateInfo);
  }

  go(url) {
    browser.tabs.update(this._tabId, { active: true, url });
  }

  close() {
    browser.windows.remove(this._windowId);
    this._reset();
  }

  protected _reset() {
    this._windowId = undefined;
    this._window = undefined;
    this._tabId = undefined;
  }
}
