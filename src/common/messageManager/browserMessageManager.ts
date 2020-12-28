/* eslint-disable class-methods-use-this */
import IMessageManager from './IMessageManager';

export default class implements IMessageManager {
  addListener(listener: any) {
    return browser.runtime.onMessage.addListener(listener);
  }

  removeListener(listener: any) {
    return browser.runtime.onMessage.removeListener(listener);
  }
}
