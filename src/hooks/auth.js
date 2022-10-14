const { Forbidden } = require("@feathersjs/errors");

function allowRoles(rolesAllowed) {
  return async ({ app, params }) => {
    params.roles = [];
    if (params.user && params.user.email) {
      const d = await app
        .service("user-roles")
        .find({ query: { email: params.user.email } });
      const roles = d.data.map(({ role }) => role);
      params.roles = roles;
    }

    for (let i = 0; i < rolesAllowed.length; i++) {
      if (params.roles.includes(rolesAllowed[i])) {
        return;
      }
    }

    throw new Forbidden('Tidak diperkenankan mengakses');
  };
}

module.exports = {
  allowRoles,
};
