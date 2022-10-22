const { Forbidden } = require("@feathersjs/errors");

/**
 * Hooks untuk membatasi akses terhadap service methods berdasarkan roles dari
 * user.
 * Cocok untuk ditempatkan pada "before hook" setelah hook `authenticate(...)`.
 * @example
 * // hanya user dengan role "ADMIN" atau "MANAJER" yang bisa mengakses service methods
 * before: {
 *   all: [authenticate("jwt"), auth.allowRoles(["ADMIN", "MANAJER"])]
 *   ...
 * }
 * @param {Array} rolesAllowed - daftar roles yang diperbolehkan
 * @returns 
 */
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
