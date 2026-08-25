import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EtudiantDeleteComponent } from './etudiant-delete.component';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';

describe('EtudiantDeleteComponent', () => {
  let component: EtudiantDeleteComponent;
  let fixture: ComponentFixture<EtudiantDeleteComponent>;
  let etudiantServiceMock: { delete: jest.Mock };
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    etudiantServiceMock = { delete: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EtudiantDeleteComponent],
      providers: [
        provideRouter([]),
        { provide: EtudiantService, useValue: etudiantServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EtudiantDeleteComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the form controls via the form getter', () => {
    expect(component.form).toBe(component.deleteForm.controls);
  });

  it('should not call delete when the form is invalid', () => {
    component.onSubmit();

    expect(etudiantServiceMock.delete).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should delete the student and reset the form on success', () => {
    etudiantServiceMock.delete.mockReturnValue(of(null));

    component.deleteForm.setValue({ id: 1 });
    component.onSubmit();

    expect(etudiantServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.deleteStatus).toBe('success');
    expect(component.isSubmitting).toBe(false);
    expect(component.submitted).toBe(false);
    expect(component.deleteForm.value).toEqual({ id: null });
  });

  it('should set an error state when delete fails', () => {
    etudiantServiceMock.delete.mockReturnValue(throwError(() => new Error('fail')));

    component.deleteForm.setValue({ id: 1 });
    component.onSubmit();

    expect(component.deleteStatus).toBe('error');
    expect(component.isSubmitting).toBe(false);
  });

  it('should log out and navigate to /login', () => {
    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
