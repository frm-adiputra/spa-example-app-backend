// Initializes the `bentuk` service on path `/bentuk`
const { Bentuk } = require("./bentuk.class");
const hooks = require("./bentuk.hooks");

module.exports = function (app) {
  const options = {
    model: "Bentuk",
    client: app.get("prisma"),
    paginate: { default: 20, max: 100 },
  };

  // Initialize our service with any options it requires
  app.use("/bentuk", new Bentuk(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("bentuk");

  service.hooks(hooks);
};
