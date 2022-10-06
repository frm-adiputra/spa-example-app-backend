// Initializes the `sumberPendanaan` service on path `/sumber-pendanaan`
const { SumberPendanaan } = require('./sumber-pendanaan.class');
const hooks = require('./sumber-pendanaan.hooks');

module.exports = function (app) {
  const options = {
    model: 'SumberPendanaan',
    client: app.get('prisma'),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sumber-pendanaan', new SumberPendanaan(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sumber-pendanaan');

  service.hooks(hooks);
};
