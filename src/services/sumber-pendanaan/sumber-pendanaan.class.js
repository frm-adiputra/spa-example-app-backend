const { PrismaService } = require('feathers-prisma');

exports.SumberPendanaan = class SumberPendanaan extends PrismaService {
  constructor({ model, ...options }, app) {
    super({
      model,
      ...options,
    }, app.get('prisma'));
  }
};
