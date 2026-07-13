import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
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
        next: () => {
          this.invalidCredentials = false;
          this.loginStatus = 'success';
          this.isSubmitting = false;
          // TODO : router l'utilisateur vers la page d'accueil
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
