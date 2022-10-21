/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("Bentuk").del();
  await knex("UserRoles").del();
  await knex("Users").del();

  await knex("UserRoles").insert([
    { email: "soulicia@gmail.com", role: "ADMIN_UNIV" },
    { email: "soulicia@gmail.com", role: "ADMIN_FAKULTAS" },
    { email: "someone@gmail.com", role: "ADMIN_FAKULTAS" },
  ]);

  // for (let i = 1; i <= 100; i++) {
  //   await knex("Bentuk").insert({ bentuk: `Bentuk ${i}` });
  // }
};
