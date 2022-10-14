const { authenticate } = require('@feathersjs/authentication').hooks;

async function logParams(context) {
  console.log(context.params.query);
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [logParams],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
