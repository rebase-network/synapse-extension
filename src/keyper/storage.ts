// const Store = require("electron-store");
import Dictionary from './Dictionary';

const KEYPER_DATA_NAME = 'keyper';

const stores = {};

const getStore = (name) => {
  if (!stores.hasOwnProperty(name)) {
    let store = new Dictionary();
    store.set(name, name);
    stores[name] = store;
  }

  return stores[name];
};

const keyperStorage = () => getStore(KEYPER_DATA_NAME);

const getSalt = () => {
  return keyperStorage().get('salt') || 'SALT_ME';
};

module.exports = {
  getStore,
  keyperStorage,
  getSalt,
};
