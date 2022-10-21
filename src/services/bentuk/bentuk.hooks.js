const { authenticate } = require("@feathersjs/authentication").hooks;
const auth = require("../../hooks/auth");
const {
  updateTimestamp,
  addOrderByRecentlyUpdated,
} = require("../../hooks/misc");
const fs = require("fs/promises");
const path = require("path");

const { hooks } = require("feathers-knex");
const { transaction } = hooks;

async function logParams(context) {
  console.log(context.params.query);
}

async function logData(context) {
  console.log(`--> ${context.method}: ${context.path}`, context.data);
}

const updateDokumen = async ({ id, app, service, data, params }) => {
  const old = await service.get(id, params);

  // file dokumen tidak berubah
  if (old.dokumen === data.dokumen) {
    return;
  }
  const catalog = app.service("file-catalog");

  // decrement usageCount pada file lama
  if (old.dokumen) {
    const oldFile = await catalog.get(old.dokumen, params);
    if (oldFile.usageCount - 1 <= 0) {
      // file tidak dibutuhkan lagi, hapus file dan hapus dari katalog
      await catalog.remove(oldFile.id, params);
      await fs.rm(path.join("uploadsDir", oldFile.id));
    } else {
      await catalog.patch(
        oldFile.id,
        { usageCount: oldFile.usageCount - 1 },
        params
      );
    }
  }

  // increment usageCount pada file baru
  if (data.dokumen) {
    const newFile = await catalog.get(data.dokumen, params);
    await catalog.patch(
      newFile.id,
      { usageCount: newFile.usageCount + 1 },
      params
    );
  }
};

module.exports = {
  before: {
    all: [authenticate("jwt"), auth.allowRoles(["ADMIN_UNIV"])],
    find: [logParams, addOrderByRecentlyUpdated],
    get: [],
    create: [
      transaction.start(),
      async ({ app, data, params }) => {
        const catalog = app.service("file-catalog");
        if (!data.dokumen) {
          return
        }
        
        const file = await catalog.get(data.dokumen, params);
        await catalog.patch(
          data.dokumen,
          { usageCount: file.usageCount + 1 },
          params
        );
      },
    ],
    update: [logData, updateTimestamp, transaction.start(), updateDokumen],
    patch: [updateTimestamp, transaction.start(), updateDokumen],
    remove: [
      transaction.start(),
      async ({ id, app, service, params }) => {
        const old = await service.get(id, params);
        if (!old.dokumen) {
          return;
        }

        const catalog = app.service("file-catalog");
        const oldFile = await catalog.get(old.dokumen, params);
        if (oldFile.usageCount - 1 <= 0) {
          // file tidak dibutuhkan lagi, hapus file dan hapus dari katalog
          await catalog.remove(oldFile.id, params);
          await fs.rm(path.join("uploadsDir", oldFile.id));
        } else {
          await catalog.patch(
            oldFile.id,
            { usageCount: oldFile.usageCount - 1 },
            params
          );
        }
      },
    ],
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
