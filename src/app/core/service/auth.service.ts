import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';

/**
 * Stocke le JWT courant en `sessionStorage` (perdu à la fermeture de l'onglet, pas partagé
 * entre onglets) et sert de source de vérité pour l'état de connexion.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}
