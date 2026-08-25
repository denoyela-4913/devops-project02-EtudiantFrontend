import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EtudiantCreateComponent } from './etudiant-create.component';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';

describe('EtudiantCreateComponent', () => {
  let component: EtudiantCreateComponent;
  let fixture: ComponentFixture<EtudiantCreateComponent>;
  let etudiantServiceMock: { create: jest.Mock };
  let authService: AuthService;
  let router: Router;

  const etudiant: Etudiant = { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@mail.com' };

  beforeEach(async () => {
    etudiantServiceMock = { create: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EtudiantCreateComponent],
      providers: [
        provideRouter([]),
        { provide: EtudiantService, useValue: etudiantServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EtudiantCreateComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the form controls via the form getter', () => {
    expect(component.form).toBe(component.createForm.controls);
  });

  it('should not call create when the form is invalid', () => {
    component.onSubmit();

    expect(etudiantServiceMock.create).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should create the student and reset the form on success', () => {
    etudiantServiceMock.create.mockReturnValue(of(etudiant));

    component.createForm.setValue(etudiant);
    component.onSubmit();

    expect(etudiantServiceMock.create).toHaveBeenCalledWith(etudiant);
    expect(component.createStatus).toBe('success');
    expect(component.isSubmitting).toBe(false);
    expect(component.submitted).toBe(false);
    expect(component.createForm.value).toEqual({ firstName: null, lastName: null, email: null });
  });

  it('should set an error state when create fails', () => {
    etudiantServiceMock.create.mockReturnValue(throwError(() => new Error('fail')));

    component.createForm.setValue(etudiant);
    component.onSubmit();

    expect(component.createStatus).toBe('error');
    expect(component.isSubmitting).toBe(false);
  });

  it('should reset the form and state on onReset', () => {
    component.submitted = true;
    component.createStatus = 'error';
    component.createForm.setValue(etudiant);

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.createStatus).toBe('idle');
    expect(component.createForm.value).toEqual({ firstName: null, lastName: null, email: null });
  });

  it('should log out and navigate to /login', () => {
    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
