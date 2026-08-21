import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';

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
