// Initializes the `UserRoles` service on path `/user-roles`
const { UserRoles } = require('./user-roles.class');
const createModel = require('../../models/user-roles.model');
const hooks = require('./user-roles.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-roles', new UserRoles(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-roles');

  service.hooks(hooks);
};
