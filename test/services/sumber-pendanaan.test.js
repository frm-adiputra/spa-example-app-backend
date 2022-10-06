const app = require('../../src/app');

describe('\'sumberPendanaan\' service', () => {
  it('registered the service', () => {
    const service = app.service('sumber-pendanaan');
    expect(service).toBeTruthy();
  });
});
