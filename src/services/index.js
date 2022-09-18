const users = require('./users/users.service.js');
const mataKuliahs = require('./mata_kuliahs/mata_kuliahs.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mataKuliahs);
};
