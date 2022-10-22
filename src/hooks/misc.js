const fs = require("fs/promises");
const path = require("path");
const { BadRequest } = require("@feathersjs/errors");

/**
 * Hook untuk memperbarui atribut updatedAt dengan waktu saat ini.
 * Cocok untuk digunakan pada "before update hook" dan "before patch hook".
 * @param {*} context
 */
async function updateTimestamp(context) {
  const org = await context.service.get(context.id, context.params);
  context.data.createdAt = org.createdAt;
  context.data.updatedAt = new Date();
}

/**
 * Hook untuk menambahkan klausa "order by updatedAt desc" di akhir query.
 * Cocok untuk digunakan pada "before find hook".
 * @param {*} context
 */
function addOrderByRecentlyUpdated(context) {
  const query = context.service.createQuery(context.params);
  query.orderBy("updatedAt", "desc");
  context.params.knex = query;
}

/**
 * Hook untuk mendapatkan detail dari file upload.
 * File upload yang dimaksud adalah yang ditentukan pada parameter `attr`.
 * Detail file disimpan pada context.data[`${attr}FileSize`] untuk besar file
 * dan context.data[`${attr}FileType`] untuk tipe file.
 * @param {*} attr
 * @returns
 */
function getFileInfo(attrs) {
  return async ({ app, data }) => {
    const uploadsSvc = app.service("uploads");
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (!data[attr]) {
        data[`${attr}__fileSize`] = null;
        data[`${attr}__fileType`] = null;
        continue;
      }

      const file = await uploadsSvc.get(data[attr]);
      data[`${attr}__fileSize`] = file.size;
      data[`${attr}__fileType`] = file.contentType;
    }
  };
}

/**
 * Hook untuk menghilangkan detail dari file upload.
 * File upload yang dimaksud adalah yang ditentukan sebagai setiap item
 * pada parameter `attrs`.
 * Detail file yang dihapus adalah context.data[`${attr}__fileSize`] dan
 * context.data[`${attr}__fileType`].
 * @param {*} attr
 * @returns
 */
function removeFileInfo(attrs) {
  return ({ data }) => {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      delete data[`${attr}__fileSize`];
      delete data[`${attr}__fileType`];
    }
  };
}

/**
 * Hook untuk mengelola pembuatan file pada katalog.
 *
 * File pada katalog adalah file hasil upload yang digunakan pada model.
 * Cocok digunakan pada "before create hook".
 * Hook ini harus digunakan setelah hook `transaction.start()`.
 * Mohon diperhatikan penggunaan `transaction.start()`, `transaction.end()`,
 * dan `transaction.rollback()` pada contoh di bawah.
 *
 * Hook ini akan menambahkan usageCount pada file yang ditentukan pada atribut `attr`.
 *
 * @example
 * // Membuat hook untuk pembuatan file katalog yang dirujuk pada atribut 'dokumen'
 * before: {
 *   ...
 *   create: [transaction.start(), createFileUpload('dokumen')],
 *   ...
 * }
 * after: {
 *   ...
 *   create: [..., transaction.end()],
 *   ...
 * }
 * error: {
 *   ...
 *   create: [transaction.rollback()],
 *   ...
 * }
 * @param {string} attr
 * @returns
 */
function createFileUpload(attr) {
  return async ({ app, data, params }) => {
    const catalog = app.service("file-catalog");
    if (!data[attr]) {
      return;
    }

    const file = await catalog.get(data[attr], params);
    await catalog.patch(
      data[attr],
      { usageCount: file.usageCount + 1 },
      params
    );
  };
}

/**
 * Hook untuk mengelola update file pada katalog.
 *
 * File pada katalog adalah file hasil upload yang digunakan pada model.
 * Cocok digunakan pada "before update hook" dan "before patch hook".
 * Hook ini harus digunakan setelah hook `transaction.start()`.
 * Mohon diperhatikan penggunaan `transaction.start()`, `transaction.end()`,
 * dan `transaction.rollback()` pada contoh di bawah.
 *
 * Bila ada perubahan pada file yang diupload, usageCount pada file lama
 * akan dikurangi 1 dan bila usageCount mencapai 0 file akan dihapus.
 * UsageCount pada file baru akan ditambah 1.
 *
 * @example
 * // Membuat hook untuk mengelola file yang dirujuk pada atribut 'dokumen'
 * before: {
 *   ...
 *   update: [transaction.start(), updateFileUpload('dokumen')],
 *   ...
 * }
 * after: {
 *   ...
 *   update: [..., transaction.end()],
 *   ...
 * }
 * error: {
 *   ...
 *   update: [transaction.rollback()],
 *   ...
 * }
 * @param {string} attr - nama atribut yang berisi id file
 * @returns
 */
function updateFileUpload(attr) {
  return async ({ id, app, service, data, params }) => {
    const old = await service.get(id, params);

    // file tidak berubah
    if (old[attr] === data[attr]) {
      return;
    }
    const catalog = app.service("file-catalog");

    // decrement usageCount pada file lama
    if (old[attr]) {
      const oldFile = await catalog.get(old[attr], params);
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
    if (data[attr]) {
      const newFile = await catalog.get(data[attr], params);
      await catalog.patch(
        newFile.id,
        { usageCount: newFile.usageCount + 1 },
        params
      );
    }
  };
}

/**
 * Hook untuk mengelola penghapusan file pada katalog.
 *
 * File pada katalog adalah file hasil upload yang digunakan pada model.
 * Cocok digunakan pada "before remove hook".
 * Hook ini harus digunakan setelah hook `transaction.start()`.
 * Mohon diperhatikan penggunaan `transaction.start()`, `transaction.end()`,
 * dan `transaction.rollback()` pada contoh di bawah.
 *
 * Hook ini akan mengurangi usageCount dengan 1 pada file yang dirujuk pada atribut `attr`.
 * Bila usageCount mencapai 0 file akan dihapus.
 *
 * @example
 * // Membuat hook untuk mengelola penghapusan file yang dirujuk pada atribut 'dokumen'
 * before: {
 *   ...
 *   remove: [transaction.start(), removeFileUpload('dokumen')],
 *   ...
 * }
 * after: {
 *   ...
 *   remove: [..., transaction.end()],
 *   ...
 * }
 * error: {
 *   ...
 *   remove: [transaction.rollback()],
 *   ...
 * }
 * @param {string} attr
 * @returns
 */
function removeFileUpload(attr) {
  return async ({ id, app, service, params }) => {
    const old = await service.get(id, params);
    if (!old[attr]) {
      return;
    }

    const catalog = app.service("file-catalog");
    const oldFile = await catalog.get(old[attr], params);
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
  };
}

function validateAndCast(schema, yupOpts, fileAttrs) {
  return (context) => {
    const data = context.data;
    try {
      schema.validateSync(data, yupOpts);
    } catch (err) {
      const errors = {};
      for (let i = 0; i < err.inner.length; i++) {
        const e = err.inner[i];
        const path = e.path.replace(/(__fileSize|__fileInfo)$/, "");
        if (!errors[path]) {
          errors[path] = e.errors[0];
        }
      }

      throw new BadRequest("Invalid data", {
        errors,
      });
    }

    const omitAttrs = [];
    for (let i = 0; i < fileAttrs.length; i++) {
      const attr = fileAttrs[i];
      omitAttrs.push(`${attr}__fileSize`);
      omitAttrs.push(`${attr}__fileType`);
    }

    context.data = schema.omit(omitAttrs).cast(data, yupOpts);
  };
}

module.exports = {
  updateTimestamp,
  addOrderByRecentlyUpdated,
  createFileUpload,
  updateFileUpload,
  removeFileUpload,
  getFileInfo,
  removeFileInfo,
  validateAndCast,
};
