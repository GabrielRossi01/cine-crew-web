import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#1a1a2e] px-4 py-12"
    >
      <div
        class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">CineCrew</h1>
          <p class="text-neutral-400">Bem-vindo de volta</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2B4393] focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <p class="mt-1 text-sm text-red-400">Email inválido.</p>
            }
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-neutral-300 mb-1"
              >Senha</label
            >
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2B4393] focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <p class="mt-1 text-sm text-red-400">Senha é obrigatória.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full bg-[#2B4393] hover:bg-[#3d5ac2] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 font-semibold transition-colors flex items-center justify-center"
          >
            @if (isLoading()) {
              <div
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
            } @else {
              Entrar
            }
          </button>
        </form>

        <div class="mt-6 flex items-center text-neutral-500">
          <div class="flex-grow border-t border-white/10"></div>
          <span class="mx-4 text-sm">ou</span>
          <div class="flex-grow border-t border-white/10"></div>
        </div>

        <button
          (click)="loginWithGoogle()"
          class="mt-6 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
          Entrar com Google
        </button>

        <p class="mt-8 text-center text-sm text-neutral-400">
          Não tem conta?
          <a routerLink="/register" class="text-[#FFC250] hover:underline font-medium"
            >Cadastre-se</a
          >
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: () => {
          this.router.navigate(['/clubs']);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
