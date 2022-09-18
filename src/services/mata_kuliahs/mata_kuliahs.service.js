// Initializes the `mata_kuliahs` service on path `/mata-kuliahs`
const { MataKuliahs } = require('./mata_kuliahs.class');
const hooks = require('./mata_kuliahs.hooks');

module.exports = function (app) {
  const options = {
    model: 'mataKuliahs',
    client: app.get('prisma'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mata-kuliahs', new MataKuliahs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mata-kuliahs');

  service.hooks(hooks);
};
