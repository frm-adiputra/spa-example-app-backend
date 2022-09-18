const app = require('../../src/app');

describe('\'mata_kuliahs\' service', () => {
  it('registered the service', () => {
    const service = app.service('mata-kuliahs');
    expect(service).toBeTruthy();
  });
});
