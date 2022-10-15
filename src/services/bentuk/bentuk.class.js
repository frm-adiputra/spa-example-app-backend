const { Service } = require("feathers-knex");

exports.Bentuk = class Bentuk extends Service {
  constructor(options) {
    super({
      ...options,
      name: "Bentuk",
    });
  }
};
