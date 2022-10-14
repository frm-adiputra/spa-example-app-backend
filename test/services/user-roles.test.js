const app = require('../../src/app');

describe('\'UserRoles\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-roles');
    expect(service).toBeTruthy();
  });
});
