import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EtudiantService } from '../../core/service/etudiant.service';
import { AuthService } from '../../core/service/auth.service';
import { Etudiant } from '../../core/models/Etudiant';

@Component({
  selector: 'app-etudiant-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './etudiant-list.component.html',
  styleUrl: './etudiant-list.component.css'
})
export class EtudiantListComponent implements OnInit {
  private etudiantService = inject(EtudiantService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  etudiants: Etudiant[] = [];
  loading: boolean = false;
  error: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.error = false;
    this.etudiantService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (etudiants) => {
          this.etudiants = etudiants;
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
