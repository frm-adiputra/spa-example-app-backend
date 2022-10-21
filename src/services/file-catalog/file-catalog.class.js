const { Service } = require('feathers-knex');

exports.FileCatalog = class FileCatalog extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'FileCatalog'
    });
  }
};
