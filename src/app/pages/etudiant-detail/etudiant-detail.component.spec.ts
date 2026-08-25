import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EtudiantDetailComponent } from './etudiant-detail.component';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';

describe('EtudiantDetailComponent', () => {
  let component: EtudiantDetailComponent;
  let fixture: ComponentFixture<EtudiantDetailComponent>;
  let etudiantServiceMock: { getById: jest.Mock };
  let authService: AuthService;
  let router: Router;

  const etudiant: Etudiant = { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@mail.com' };

  beforeEach(async () => {
    etudiantServiceMock = { getById: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EtudiantDetailComponent],
      providers: [
        provideRouter([]),
        { provide: EtudiantService, useValue: etudiantServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EtudiantDetailComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the form controls via the form getter', () => {
    expect(component.form).toBe(component.searchForm.controls);
  });

  it('should not call getById when the search form is invalid', () => {
    component.onSubmit();

    expect(etudiantServiceMock.getById).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should load the student when the search succeeds', () => {
    etudiantServiceMock.getById.mockReturnValue(of(etudiant));

    component.searchForm.setValue({ id: 1 });
    component.onSubmit();

    expect(etudiantServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.etudiant).toEqual(etudiant);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should set an error state when the search fails', () => {
    etudiantServiceMock.getById.mockReturnValue(throwError(() => new Error('not found')));

    component.searchForm.setValue({ id: 999 });
    component.onSubmit();

    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should log out and navigate to /login', () => {
    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
