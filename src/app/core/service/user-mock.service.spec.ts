import { UserMockService } from './user-mock.service';

describe('UserMockService', () => {
  let service: UserMockService;

  beforeEach(() => {
    service = new UserMockService();
  });

  it('register should return an observable', (done) => {
    service.register({ firstName: 'Jean', lastName: 'Dupont', login: 'jdupont', password: 'secret' })
      .subscribe({ complete: () => done() });
  });

  it('login should return an observable', (done) => {
    service.login({ login: 'jdupont', password: 'secret' })
      .subscribe({ complete: () => done() });
  });
});
