// Initializes the `FileCatalog` service on path `/file-catalog`
const { FileCatalog } = require('./file-catalog.class');
const createModel = require('../../models/file-catalog.model');
const hooks = require('./file-catalog.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/file-catalog', new FileCatalog(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('file-catalog');

  service.hooks(hooks);
};
