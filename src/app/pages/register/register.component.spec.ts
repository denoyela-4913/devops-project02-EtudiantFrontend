import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let alertSpy: jest.SpyInstance;

  beforeEach(async () => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        // Stub neutre : register() renvoie un observable vide ; chaque test le surcharge
        // au besoin avec jest.spyOn(...).mockReturnValue(...) pour contrôler la réponse.
        { provide: UserService, useValue: { register: () => of() } },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the form controls via the form getter', () => {
    expect(component.form).toBe(component.registerForm.controls);
  });

  it('should not call userService.register when the form is invalid', () => {
    jest.spyOn(userService, 'register');

    component.onSubmit();

    expect(userService.register).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should call userService.register with the form payload when valid', () => {
    jest.spyOn(userService, 'register').mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'Jean',
      lastName: 'Dupont',
      login: 'jdupont',
      password: 'secret'
    });
    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'Jean',
      lastName: 'Dupont',
      login: 'jdupont',
      password: 'secret'
    });
    expect(alertSpy).toHaveBeenCalled();
  });

  it('should reset the form and state on onReset', () => {
    component.submitted = true;
    component.registerForm.setValue({
      firstName: 'Jean',
      lastName: 'Dupont',
      login: 'jdupont',
      password: 'secret'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null
    });
  });
});
