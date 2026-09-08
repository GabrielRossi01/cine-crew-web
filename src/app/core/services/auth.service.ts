import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { UserSummary } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  private readonly _currentUser = signal<UserSummary | null>(null);
  private readonly _token = signal<string | null>(this.getStoredToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token() && !this.isTokenExpired());

  constructor() {
    if (this._token()) {
      this.loadCurrentUser();
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, request)
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, request)
      .pipe(tap((response) => this.handleAuthResponse(response)));
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
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_token_expiry');
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  loadCurrentUser(): void {
    this.http.get<UserSummary>(`${this.apiUrl}/auth/me`).subscribe({
      next: (user) => this._currentUser.set(user),
      error: () => this.logout(),
    });
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
    if (token && !this.isTokenExpired()) {
      return token;
    }
    return null;
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem('cc_token_expiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry, 10);
  }
}
