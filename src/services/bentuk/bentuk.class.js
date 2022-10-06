const { PrismaService } = require('feathers-prisma');

exports.Bentuk = class Bentuk extends PrismaService {
  constructor({ model, ...options }, app) {
    super({
      model,
      ...options,
    }, app.get('prisma'));
  }
};
