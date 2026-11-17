const { isConnected } = require('../config/db');
const { createModel } = require('../config/embeddedStore');

function createBridge(collectionName, mongooseModel) {
  const embeddedModel = createModel(collectionName);

  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (isConnected()) {
        return target[prop];
      }
      if (prop in embeddedModel) {
        return embeddedModel[prop];
      }
      return target[prop];
    },
  });
}

module.exports = { createBridge };
