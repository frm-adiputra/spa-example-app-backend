/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("public")
    .createTable("Users", function (t) {
      t.uuid("id", { primaryKey: true })
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("googleId").notNullable().unique();
      t.string("email").notNullable().unique();
      t.string("name");
      t.string("profilePicture");
    })
    .createTable("UserRoles", function (t) {
      t.uuid("id", { primaryKey: true })
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("email").notNullable();
      t.enu("role", [
        "ADMIN_UNIV",
        "ADMIN_FAKULTAS",
        "ADMIN_PRODI",
        "MANAJER_UNIV",
        "MANAJER_FAKULTAS",
        "MANAJER_PRODI",
      ]).notNullable();
      t.unique(["email", "role"]);
    })
    .createTable("FileCatalog", function (t) {
      t.string("id").notNullable().primary();
      t.integer("usageCount").notNullable().defaultTo(0);
      t.timestamps(true, true, true);
    })
    .createTable("Bentuk", function (t) {
      t.uuid("id", { primaryKey: true })
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
      t.string("bentuk").notNullable().unique();
      t.string("dokumen");
      t.timestamps(true, true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("public")
    .dropTableIfExists("Bentuk")
    .dropTableIfExists("FileCatalog")
    .dropTableIfExists("Users")
    .dropTableIfExists("UserRoles");
};
