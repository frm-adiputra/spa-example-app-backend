const { authenticate } = require("@feathersjs/authentication").hooks;
const dauria = require("dauria");

module.exports = {
  before: {
    // all: [authenticate("jwt")],
    all: [],
    find: [],
    get: [],
    create: [
      (context) => {
        console.log("==>", "UPLOADS");
        console.log("==> Data", context.data);
        console.log("==> Params", context.params);
        if (!context.data.uri && context.params.file) {
          const file = context.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          context.data = { uri: uri };
        }
        return context;
      },
    ],
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
