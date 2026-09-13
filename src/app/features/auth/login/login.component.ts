import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main
      class="login-page min-h-screen bg-[var(--cc-bg-base)] px-5 py-8 text-[var(--cc-text-primary)] sm:px-8"
    >
      <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header class="flex items-center justify-between">
          <a
            routerLink="/"
            class="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)]"
            aria-label="CineCrew - Página inicial"
          >
            <img
              src="cine-crew-logo.svg"
              alt="CineCrew"
              class="h-9 w-auto object-contain"
            />
          </a>

          <p class="text-xs text-[var(--cc-text-muted)] sm:text-sm">
            Ainda não tem conta?
            <a
              routerLink="/register"
              class="ml-1 font-semibold text-[var(--cc-text-primary)] underline decoration-[var(--cc-text-subtle)] underline-offset-4 transition-colors hover:text-[#FFC250]"
            >
              Criar conta
            </a>
          </p>
        </header>

        <section class="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-12">
          <div class="text-center">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
              Bem-vindo de volta
            </span>

            <h1
              class="mt-3 font-sora text-3xl font-semibold tracking-[-0.04em] text-[var(--cc-text-primary)] sm:text-4xl"
            >
              Entre na sua crew
            </h1>

            <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
              Acesse seus clubes, sessões e memórias do CineCrew.
            </p>
          </div>

          <div
            class="mt-8 rounded-2xl border border-[var(--cc-border-default)] bg-[var(--cc-bg-elevated)] p-5 shadow-[var(--cc-shadow-card)] backdrop-blur-2xl sm:p-7"
          >
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div>
                <label
                  for="email"
                  class="mb-2 block text-sm font-medium text-[var(--cc-text-secondary)]"
                >
                  Seu e-mail
                </label>

                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  autocomplete="email"
                  class="login-input"
                  placeholder="seu@email.com"
                  autofocus
                />

                @if (isFieldInvalid('email')) {
                  <p class="form-error">Informe um e-mail válido.</p>
                }
              </div>

              <div class="mt-5">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <label
                    for="password"
                    class="block text-sm font-medium text-[var(--cc-text-secondary)]"
                  >
                    Sua senha
                  </label>
                </div>

                <input
                  id="password"
                  type="password"
                  formControlName="password"
                  autocomplete="current-password"
                  class="login-input"
                  placeholder="Digite sua senha"
                />

                @if (isFieldInvalid('password')) {
                  <p class="form-error">Senha é obrigatória.</p>
                }
              </div>

              <button
                type="submit"
                class="primary-button mt-6"
                [disabled]="loginForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="loading-spinner"></span>
                  Entrando...
                } @else {
                  Entrar na minha conta
                  <span aria-hidden="true">→</span>
                }
              </button>
            </form>

            <div class="my-6 flex items-center gap-4">
              <div class="h-px flex-1 bg-[var(--cc-border-subtle)]"></div>
              <span class="text-xs uppercase tracking-[0.14em] text-[var(--cc-text-subtle)]">
                ou
              </span>
              <div class="h-px flex-1 bg-[var(--cc-border-subtle)]"></div>
            </div>

            <button
              type="button"
              class="google-button"
              [disabled]="isLoading()"
              (click)="loginWithGoogle()"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>

              Continuar com Google
            </button>
          </div>

          <p class="mt-6 text-center text-xs leading-5 text-[var(--cc-text-muted)]">
            Ao entrar, você poderá continuar organizando seus clubes, pagamentos e memórias.
          </p>
        </section>

        <footer class="text-center text-xs text-[var(--cc-text-subtle)]">
          © {{ currentYear }} CineCrew
        </footer>
      </div>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .login-page {
      min-height: 100vh;
    }

    .login-input {
      display: block;
      width: 100%;
      min-height: 48px;
      border: 1px solid var(--cc-border-default);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
      outline: none;
      transition:
        border-color 200ms ease,
        box-shadow 200ms ease,
        background-color 200ms ease;
    }

    .login-input::placeholder {
      color: var(--cc-text-subtle);
    }

    .login-input:focus {
      border-color: #2b4393;
      box-shadow: 0 0 0 3px rgba(43, 67, 147, 0.2);
    }

    .form-error {
      margin-top: 0.4rem;
      color: #f87171;
      font-size: 0.75rem;
      line-height: 1.25rem;
    }

    .forgot-password {
      color: var(--cc-text-muted);
      font-size: 0.6875rem;
      font-weight: 600;
      transition: color 200ms ease;
    }

    .forgot-password:hover {
      color: #ffc250;
    }

    .primary-button,
    .google-button {
      display: inline-flex;
      min-height: 46px;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      transition:
        background-color 200ms ease,
        border-color 200ms ease,
        color 200ms ease,
        opacity 200ms ease,
        transform 200ms ease;
    }

    .primary-button {
      color: #111827;
      background: #ffc250;
    }

    .primary-button:hover:not(:disabled) {
      background: #ffd477;
      transform: translateY(-1px);
    }

    .primary-button:disabled,
    .google-button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .google-button {
      border: 1px solid var(--cc-border-default);
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
      font-weight: 600;
    }

    .google-button:hover:not(:disabled) {
      border-color: var(--cc-border-strong);
      background: var(--cc-bg-elevated);
      transform: translateY(-1px);
    }

    .loading-spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(17, 24, 39, 0.25);
      border-top-color: #111827;
      border-radius: 9999px;
      animation: login-spin 700ms linear infinite;
    }

    @keyframes login-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .login-input,
      .forgot-password,
      .primary-button,
      .google-button,
      .loading-spinner {
        animation: none;
        transition: none;
      }
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly isLoading = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.authService
      .login({
        email: email ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/clubs']);
        },
        error: (error) => {
          console.error('Erro ao fazer login:', error);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  loginWithGoogle(): void {
    if (this.isLoading()) {
      return;
    }

    this.authService.loginWithGoogle();
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);

    return Boolean(control?.touched && control.invalid);
  }

  onForgotPassword(): void {
    console.info('Fluxo de recuperação de senha ainda não implementado.');
  }
}
