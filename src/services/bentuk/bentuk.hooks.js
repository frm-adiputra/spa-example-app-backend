const { authenticate } = require("@feathersjs/authentication").hooks;
const auth = require("../../hooks/auth");

async function logParams(context) {
  console.log(context.params.query);
}

async function logData(context) {
  console.log(`--> ${context.method}: ${context.path}`, context.data);
}

module.exports = {
  before: {
    all: [authenticate("jwt"), auth.allowRoles(["ADMIN_UNIV"])],
    find: [
      logParams,
      (context) => {
        const query = context.service.createQuery(context.params);
        query.orderBy("updatedAt", "desc");
        context.params.knex = query;
        return context;
      },
    ],
    get: [],
    create: [],
    update: [
      logData,
      async (context) => {
        const org = await context.service.get(context.id, context.params);
        context.data.createdAt = org.createdAt;
        context.data.updatedAt = new Date();
        return context;
      },
    ],
    patch: [
      async (context) => {
        const org = await context.service.get(context.id, context.params);
        context.data.updatedAt = new Date();
        return context;
      },
    ],
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
