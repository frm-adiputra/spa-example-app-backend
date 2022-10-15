/* eslint-disable no-console */

// UserRoles-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get("knexClient");
  const tableName = "Bentuk";
  db.schema.hasTable(tableName).then((exists) => {
    if (!exists) {
      db.schema
        .createTable(tableName, (t) => {
          t.uuid("id", { primaryKey: true })
            .notNullable()
            .defaultTo(knex.raw("uuid_generate_v4()"));
          t.string("bentuk").notNullable().unique();
          t.timestamps(true, true, true);
        })
        .then(() => console.log(`Created ${tableName} table`))
        .catch((e) => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
