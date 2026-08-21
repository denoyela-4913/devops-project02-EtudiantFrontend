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
  selector: 'app-etudiant-update',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './etudiant-update.component.html',
  styleUrl: './etudiant-update.component.css'
})
export class EtudiantUpdateComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loadForm: FormGroup = new FormGroup({});
  updateForm: FormGroup = new FormGroup({});
  loadSubmitted: boolean = false;
  updateSubmitted: boolean = false;
  loading: boolean = false;
  loadError: boolean = false;
  isSubmitting: boolean = false;
  updateStatus: 'idle' | 'success' | 'error' = 'idle';
  etudiantLoaded: boolean = false;

  ngOnInit(): void {
    this.loadForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get loadFormControls() {
    return this.loadForm.controls;
  }

  get updateFormControls() {
    return this.updateForm.controls;
  }

  onLoad(): void {
    this.loadSubmitted = true;
    this.loadError = false;
    this.etudiantLoaded = false;
    this.updateStatus = 'idle';

    if (this.loadForm.invalid) {
      return;
    }

    this.loading = true;
    const id = this.loadForm.get('id')?.value;

    this.etudiantService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (etudiant) => {
          this.updateForm.patchValue(etudiant);
          this.etudiantLoaded = true;
          this.loading = false;
        },
        error: () => {
          this.loadError = true;
          this.loading = false;
        }
      });
  }

  onUpdate(): void {
    this.updateSubmitted = true;
    this.updateStatus = 'idle';

    if (this.updateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const id = this.loadForm.get('id')?.value;
    const etudiant: Etudiant = {
      firstName: this.updateForm.get('firstName')?.value?.trim(),
      lastName: this.updateForm.get('lastName')?.value?.trim(),
      email: this.updateForm.get('email')?.value?.trim()
    };

    this.etudiantService.update(id, etudiant)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.updateStatus = 'success';
          this.isSubmitting = false;
        },
        error: () => {
          this.updateStatus = 'error';
          this.isSubmitting = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
