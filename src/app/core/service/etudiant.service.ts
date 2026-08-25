import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/Etudiant';

/** Accès CRUD à l'API REST `/api/etudiants`. Aucune logique métier : un simple passe-plat HTTP. */
@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Etudiant[]> {
    return this.httpClient.get<Etudiant[]>('/api/etudiants');
  }

  getById(id: number): Observable<Etudiant> {
    return this.httpClient.get<Etudiant>(`/api/etudiants/${id}`);
  }

  create(etudiant: Etudiant): Observable<Etudiant> {
    return this.httpClient.post<Etudiant>('/api/etudiants', etudiant);
  }

  /** Remplacement complet de l'étudiant `id` par `etudiant` (PUT, pas de patch partiel). */
  update(id: number, etudiant: Etudiant): Observable<Etudiant> {
    return this.httpClient.put<Etudiant>(`/api/etudiants/${id}`, etudiant);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/etudiants/${id}`);
  }
}
