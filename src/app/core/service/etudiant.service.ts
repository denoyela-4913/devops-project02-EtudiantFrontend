import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/Etudiant';

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

  update(id: number, etudiant: Etudiant): Observable<Etudiant> {
    return this.httpClient.put<Etudiant>(`/api/etudiants/${id}`, etudiant);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/etudiants/${id}`);
  }
}
