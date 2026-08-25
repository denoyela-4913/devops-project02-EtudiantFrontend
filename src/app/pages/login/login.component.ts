import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',

  styleUrl: './login.component.css'
})
/** Authentifie l'utilisateur, stocke le JWT reçu via `AuthService`, puis redirige vers `/etudiants`. */
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  invalidCredentials: boolean = false;
  loginStatus: 'idle' | 'success' | 'error' = 'idle';
  isSubmitting: boolean = false;

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.invalidCredentials = false;
    this.loginStatus = 'idle';
    this.isSubmitting = true;

    if (this.loginForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const loginUser: Login = {
      login: this.loginForm.get('login')?.value?.trim(),
      password: this.loginForm.get('password')?.value?.trim()
    };

    this.userService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.invalidCredentials = false;
          this.loginStatus = 'success';
          this.isSubmitting = false;
          this.router.navigate(['/etudiants']);
        },
        error: () => {
          this.invalidCredentials = true;
          this.loginStatus = 'error';
          this.isSubmitting = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.invalidCredentials = false;
    this.loginStatus = 'idle';
    this.isSubmitting = false;
    this.loginForm.reset();
  }
}
