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
  selector: 'app-etudiant-detail',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './etudiant-detail.component.html',
  styleUrl: './etudiant-detail.component.css'
})
export class EtudiantDetailComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  searchForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  etudiant: Etudiant | null = null;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
  }

  get form() {
    return this.searchForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.etudiant = null;
    this.error = false;

    if (this.searchForm.invalid) {
      return;
    }

    this.loading = true;
    const id = this.searchForm.get('id')?.value;

    this.etudiantService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (etudiant) => {
          this.etudiant = etudiant;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
