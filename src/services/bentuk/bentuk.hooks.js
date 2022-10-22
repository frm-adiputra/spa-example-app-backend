const { authenticate } = require("@feathersjs/authentication").hooks;
const auth = require("../../hooks/auth");
const {
  updateTimestamp,
  addOrderByRecentlyUpdated,
  createFileUpload,
  updateFileUpload,
  removeFileUpload,
} = require("../../hooks/misc");

const { hooks } = require("feathers-knex");
const { transaction } = hooks;

module.exports = {
  before: {
    all: [authenticate("jwt"), auth.allowRoles(["ADMIN_UNIV"])],
    find: [addOrderByRecentlyUpdated],
    get: [],
    create: [transaction.start(), createFileUpload("dokumen")],
    update: [updateTimestamp, transaction.start(), updateFileUpload("dokumen")],
    patch: [updateTimestamp, transaction.start(), updateFileUpload("dokumen")],
    remove: [transaction.start(), removeFileUpload("dokumen")],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [transaction.end()],
    update: [transaction.end()],
    patch: [transaction.end()],
    remove: [transaction.end()],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [transaction.rollback()],
    update: [transaction.rollback()],
    patch: [transaction.rollback()],
    remove: [transaction.rollback()],
  },
};
