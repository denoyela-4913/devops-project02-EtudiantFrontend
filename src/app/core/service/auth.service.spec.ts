import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have no token and report as logged out initially', () => {
    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should store the token in sessionStorage on setToken', () => {
    service.setToken('abc123');

    expect(sessionStorage.getItem('authToken')).toBe('abc123');
    expect(service.getToken()).toBe('abc123');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should remove the token from sessionStorage on logout', () => {
    service.setToken('abc123');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});
