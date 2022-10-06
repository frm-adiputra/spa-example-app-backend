const app = require('../../src/app');

describe('\'bentuk\' service', () => {
  it('registered the service', () => {
    const service = app.service('bentuk');
    expect(service).toBeTruthy();
  });
});
