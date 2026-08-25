import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { EtudiantService } from './etudiant.service';
import { Etudiant } from '../models/Etudiant';

describe('EtudiantService', () => {
  let service: EtudiantService;
  let httpMock: HttpTestingController;

  const etudiant: Etudiant = { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@mail.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // EtudiantService injecte HttpClient : sans ce provider, TestBed.inject
      // échoue avec un NullInjectorError.
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EtudiantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should GET /api/etudiants', () => {
    service.getAll().subscribe((result) => {
      expect(result).toEqual([etudiant]);
    });

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('GET');
    req.flush([etudiant]);
  });

  it('getById should GET /api/etudiants/:id', () => {
    service.getById(1).subscribe((result) => {
      expect(result).toEqual(etudiant);
    });

    const req = httpMock.expectOne('/api/etudiants/1');
    expect(req.request.method).toBe('GET');
    req.flush(etudiant);
  });

  it('create should POST /api/etudiants with the payload', () => {
    service.create(etudiant).subscribe((result) => {
      expect(result).toEqual(etudiant);
    });

    const req = httpMock.expectOne('/api/etudiants');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(etudiant);
    req.flush(etudiant);
  });

  it('update should PUT /api/etudiants/:id with the payload', () => {
    service.update(1, etudiant).subscribe((result) => {
      expect(result).toEqual(etudiant);
    });

    const req = httpMock.expectOne('/api/etudiants/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(etudiant);
    req.flush(etudiant);
  });

  it('delete should DELETE /api/etudiants/:id', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne('/api/etudiants/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
