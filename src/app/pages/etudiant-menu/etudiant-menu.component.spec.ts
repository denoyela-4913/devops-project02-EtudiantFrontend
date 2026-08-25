import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { EtudiantMenuComponent } from './etudiant-menu.component';
import { AuthService } from '../../core/service/auth.service';

describe('EtudiantMenuComponent', () => {
  let component: EtudiantMenuComponent;
  let fixture: ComponentFixture<EtudiantMenuComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantMenuComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EtudiantMenuComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the list of student actions', () => {
    expect(component.actions.length).toBe(5);
    expect(component.actions[0]).toEqual({ label: 'Liste des étudiants', path: '/etudiants/liste' });
  });

  it('should log out and navigate to /login', () => {
    jest.spyOn(authService, 'logout');
    jest.spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
