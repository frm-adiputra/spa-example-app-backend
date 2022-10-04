const { authenticate } = require("@feathersjs/authentication").hooks;

async function logData(context) {
  console.log("-->", context.data);
}

async function logType(context) {
  console.log("==>", context.type, context.method);
}

async function logError(context) {
  console.error(context.error.message)
}

async function logResult(context) {
  console.log('--> RESULT')
  console.log(context.result)
}
module.exports = {
  before: {
    all: [logType],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [logData],
    update: [authenticate("jwt")],
    patch: [authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [],
    find: [logResult],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [logError],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
