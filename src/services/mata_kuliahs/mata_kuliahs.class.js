const { PrismaService } = require('feathers-prisma');

exports.MataKuliahs = class MataKuliahs extends PrismaService {
  constructor({ model, ...options }, app) {
    super({
      model,
      ...options,
    }, app.get('prisma'));
  }
};
