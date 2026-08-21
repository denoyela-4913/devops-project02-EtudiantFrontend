import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-etudiant-delete',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './etudiant-delete.component.html',
  styleUrl: './etudiant-delete.component.css'
})
export class EtudiantDeleteComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  deleteForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isSubmitting: boolean = false;
  deleteStatus: 'idle' | 'success' | 'error' = 'idle';

  ngOnInit(): void {
    this.deleteForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
  }

  get form() {
    return this.deleteForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.deleteStatus = 'idle';

    if (this.deleteForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const id = this.deleteForm.get('id')?.value;

    this.etudiantService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deleteStatus = 'success';
          this.isSubmitting = false;
          this.deleteForm.reset();
          this.submitted = false;
        },
        error: () => {
          this.deleteStatus = 'error';
          this.isSubmitting = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
