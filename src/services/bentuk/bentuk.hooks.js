const { authenticate } = require("@feathersjs/authentication").hooks;
const auth = require("../../hooks/auth");
const {
  updateTimestamp,
  addOrderByRecentlyUpdated,
  createFileUpload,
  updateFileUpload,
  removeFileUpload,
  getFileInfo,
  validateAndCast,
} = require("../../hooks/misc");

const { BadRequest } = require("@feathersjs/errors");
const { hooks } = require("feathers-knex");
const { transaction } = hooks;
const yup = require("yup");

const schema = yup.object().shape({
  bentuk: yup.string().trim().required().min(2).max(4),
  dokumen: yup.string().trim().nullable(),
  dokumen__fileSize: yup.number().when("dokumen", {
    is: (v) => yup.string().trim().isValidSync(v),
    then: yup.number().max(3000000, "Ukuran file maksimal ${max} B"),
    otherwise: yup.mixed().nullable(),
  }),
  dokumen__fileType: yup.string().when("dokumen", {
    is: (v) => yup.string().trim().isValidSync(v),
    then: yup.string().matches(/application\/vnd.openxmlformats-officedocument.presentationml.presentation/),
    otherwise: yup.mixed().nullable(),
  }),
});

const patchSchema = yup.object().shape({
  bentuk: yup.string().trim().nullable().min(2).max(4),
  dokumen: yup.string().trim().nullable(),
  dokumen__fileSize: yup.number().when("dokumen", {
    is: (v) => yup.string().trim().isValidSync(v),
    then: yup.number().max(3, "Ukuran file maksimal ${max} B"),
    otherwise: yup.mixed().nullable(),
  }),
});

const yupOpts = {
  abortEarly: false,
  stripUnknown: true,
};

module.exports = {
  before: {
    all: [authenticate("jwt"), auth.allowRoles(["ADMIN_UNIV"])],
    find: [addOrderByRecentlyUpdated],
    get: [],
    create: [
      getFileInfo(["dokumen"]),
      validateAndCast(schema, yupOpts, ["dokumen"]),
      transaction.start(),
      createFileUpload("dokumen"),
    ],
    update: [
      validateAndCast(schema, yupOpts, ["dokumen"]),
      updateTimestamp,
      transaction.start(),
      updateFileUpload("dokumen"),
    ],
    patch: [
      validateAndCast(patchSchema, yupOpts, ["dokumen"]),
      updateTimestamp,
      transaction.start(),
      updateFileUpload("dokumen"),
    ],
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
