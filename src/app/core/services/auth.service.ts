import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { UserSummary } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly _currentUser = signal<UserSummary | null>(null);
  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _isLoadingUser = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoadingUser = this._isLoadingUser.asReadonly();

  readonly isAuthenticated = computed(() => {
    const token = this._token();

    return Boolean(token && !this.isTokenExpired());
  });

  constructor() {
    if (this._token()) {
      this.loadCurrentUser();
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        this.handleAuthResponse(response);
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, request).pipe(
      tap((response) => {
        this.handleAuthResponse(response);
      }),
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/oauth2/authorization/google`;
  }

  handleOAuth2Redirect(token: string, expiresIn: number): void {
    this.storeToken(token, expiresIn);
    this._token.set(token);
    this.loadCurrentUser();
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  loadCurrentUser(): void {
    if (!this._token() || this.isTokenExpired()) {
      this.clearSession();
      return;
    }

    this._isLoadingUser.set(true);

    this.http.get<UserSummary>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this._currentUser.set(user);
        this._isLoadingUser.set(false);
      },
      error: (error) => {
        this._isLoadingUser.set(false);

        if (error.status === 401 || error.status === 403) {
          this.clearSession();
        }
      },
    });
  }

  setCurrentUser(user: UserSummary): void {
    this._currentUser.set(user);
  }

  refreshCurrentUser(): void {
    this.loadCurrentUser();
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.storeToken(response.token, response.expiresInSeconds);
    this._token.set(response.token);
    this.loadCurrentUser();
  }

  private storeToken(token: string, expiresInSeconds: number): void {
    localStorage.setItem('cc_token', token);

    const expiry = Date.now() + expiresInSeconds * 1000;

    localStorage.setItem('cc_token_expiry', expiry.toString());
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem('cc_token');
    const expiry = localStorage.getItem('cc_token_expiry');

    if (!token || !expiry) {
      this.clearStoredToken();
      return null;
    }

    if (Date.now() > Number.parseInt(expiry, 10)) {
      this.clearStoredToken();
      return null;
    }

    return token;
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem('cc_token_expiry');

    if (!expiry) {
      return true;
    }

    return Date.now() > Number.parseInt(expiry, 10);
  }

  private clearSession(): void {
    this.clearStoredToken();
    this._token.set(null);
    this._currentUser.set(null);
  }

  private clearStoredToken(): void {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_token_expiry');
  }
}
