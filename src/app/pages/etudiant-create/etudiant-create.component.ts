import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';
import { getHttpStatusText } from '../../shared/utils/http-status.util';

const CREATE_SUCCESS_STATUS = 201;

@Component({
  selector: 'app-etudiant-create',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './etudiant-create.component.html',
  styleUrl: './etudiant-create.component.css'
})
/**
 * Formulaire de création d'un étudiant. Le résultat de l'appel (succès ou erreur HTTP) est
 * conservé dans `createResult`/`createStatus` pour piloter l'affichage et le tooltip du bouton,
 * plutôt que d'être seulement loggé.
 */
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
  createResult: { status: number; message?: string; success: boolean } | null = null;

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

  /** Texte du tooltip : code + libellé HTTP, et message d'erreur du backend en cas d'échec. */
  get createTooltip(): string {
    if (!this.createResult) {
      return '';
    }
    const statusLine = `${this.createResult.status} ${getHttpStatusText(this.createResult.status)}`;
    return this.createResult.success
      ? statusLine
      : `${statusLine}\n${this.createResult.message}`;
  }

  onSubmit(): void {
    this.submitted = true;
    this.createStatus = 'idle';
    this.createResult = null;

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
          this.createResult = { status: CREATE_SUCCESS_STATUS, success: true };
          this.isSubmitting = false;
          this.createForm.reset();
          this.submitted = false;
        },
        error: (err: HttpErrorResponse) => {
          this.createStatus = 'error';
          this.createResult = {
            status: err.status,
            message: err.error?.message ?? 'Erreur inconnue.',
            success: false
          };
          this.isSubmitting = false;
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.createStatus = 'idle';
    this.createResult = null;
    this.createForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
