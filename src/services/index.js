const users = require('./users/users.service.js');
const mataKuliahs = require('./mata_kuliahs/mata_kuliahs.service.js');
const bentuk = require('./bentuk/bentuk.service.js');
const sumberPendanaan = require('./sumber-pendanaan/sumber-pendanaan.service.js');
const userRoles = require('./user-roles/user-roles.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mataKuliahs);
  app.configure(bentuk);
  app.configure(sumberPendanaan);
  app.configure(userRoles);
};
