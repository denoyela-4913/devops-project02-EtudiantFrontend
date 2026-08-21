import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';

@Component({
  selector: 'app-etudiant-create',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './etudiant-create.component.html',
  styleUrl: './etudiant-create.component.css'
})
export class EtudiantCreateComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  createForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isSubmitting: boolean = false;
  createStatus: 'idle' | 'success' | 'error' = 'idle';

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get form() {
    return this.createForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.createStatus = 'idle';

    if (this.createForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const etudiant: Etudiant = {
      firstName: this.createForm.get('firstName')?.value?.trim(),
      lastName: this.createForm.get('lastName')?.value?.trim(),
      email: this.createForm.get('email')?.value?.trim()
    };

    this.etudiantService.create(etudiant)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.createStatus = 'success';
          this.isSubmitting = false;
          this.createForm.reset();
          this.submitted = false;
        },
        error: () => {
          this.createStatus = 'error';
          this.isSubmitting = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.createStatus = 'idle';
    this.createForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
