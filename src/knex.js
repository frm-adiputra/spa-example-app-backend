const knex = require('knex');

module.exports = function (app) {
  const connection = app.get('postgres');
  // const { client, connection } = app.get('postgres');
  // const db = knex({ client, connection });
  const db = knex({ client: 'pg', connection });

  app.set('knexClient', db);
};
