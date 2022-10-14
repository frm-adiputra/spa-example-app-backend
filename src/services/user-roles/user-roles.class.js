const { Service } = require('feathers-knex');

exports.UserRoles = class UserRoles extends Service {
  constructor(options) {
    super({
      ...options,
      name: 'UserRoles'
    });
  }
};
