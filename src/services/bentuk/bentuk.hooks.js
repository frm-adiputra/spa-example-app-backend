const { authenticate } = require("@feathersjs/authentication").hooks;
const auth = require('../../hooks/auth')

async function logParams(context) {
  console.log(context.params.query);
}

module.exports = {
  before: {
    all: [authenticate("jwt"), auth.allowRoles(['ADMIN_UNIV'])],
    find: [logParams],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
