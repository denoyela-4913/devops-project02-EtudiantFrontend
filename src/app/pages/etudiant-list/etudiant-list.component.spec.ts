import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EtudiantListComponent } from './etudiant-list.component';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';

describe('EtudiantListComponent', () => {
  let component: EtudiantListComponent;
  let fixture: ComponentFixture<EtudiantListComponent>;
  let etudiantServiceMock: { getAll: jest.Mock };
  let authService: AuthService;
  let router: Router;

  const etudiant: Etudiant = { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@mail.com' };

  beforeEach(async () => {
    etudiantServiceMock = { getAll: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EtudiantListComponent],
      providers: [
        provideRouter([]),
        { provide: EtudiantService, useValue: etudiantServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EtudiantListComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create and populate the list on successful load', () => {
    etudiantServiceMock.getAll.mockReturnValue(of([etudiant]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.etudiants).toEqual([etudiant]);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should set an error state when loading fails', () => {
    etudiantServiceMock.getAll.mockReturnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should log out and navigate to /login', () => {
    etudiantServiceMock.getAll.mockReturnValue(of([]));
    fixture.detectChanges();

    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
