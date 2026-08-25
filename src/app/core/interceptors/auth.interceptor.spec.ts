import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add an Authorization header when no token is present', () => {
    httpClient.get('/api/etudiants').subscribe();

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add a Bearer Authorization header when a token is present', () => {
    authService.setToken('abc123');

    httpClient.get('/api/etudiants').subscribe();

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });
});
