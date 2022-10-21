const app = require('../../src/app');

describe('\'FileCatalog\' service', () => {
  it('registered the service', () => {
    const service = app.service('file-catalog');
    expect(service).toBeTruthy();
  });
});
