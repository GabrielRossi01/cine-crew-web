import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
          <h1 class="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
          <p class="text-neutral-400">Junte-se ao CineCrew hoje mesmo</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-neutral-300 mb-1">Nome</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2B4393] focus:border-transparent transition-all"
              placeholder="Seu nome"
            />
            @if (registerForm.get('name')?.touched && registerForm.get('name')?.invalid) {
              <p class="mt-1 text-sm text-red-400">Nome é obrigatório.</p>
            }
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-neutral-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2B4393] focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
            @if (registerForm.get('email')?.touched && registerForm.get('email')?.invalid) {
              <p class="mt-1 text-sm text-red-400">Email válido é obrigatório.</p>
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
              placeholder="Min. 8 caracteres"
            />
            @if (registerForm.get('password')?.touched && registerForm.get('password')?.invalid) {
              <p class="mt-1 text-sm text-red-400">Senha deve ter no mínimo 8 caracteres.</p>
            }
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-neutral-300 mb-1"
              >Confirmar Senha</label
            >
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#2B4393] focus:border-transparent transition-all"
              placeholder="Confirme sua senha"
            />
            @if (
              registerForm.get('confirmPassword')?.touched &&
              registerForm.errors?.['passwordMismatch']
            ) {
              <p class="mt-1 text-sm text-red-400">As senhas não coincidem.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="w-full bg-[#2B4393] hover:bg-[#3d5ac2] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 font-semibold transition-colors flex items-center justify-center mt-2"
          >
            @if (isLoading()) {
              <div
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
            } @else {
              Criar conta
            }
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-neutral-400">
          Já tem conta?
          <a routerLink="/login" class="text-[#FFC250] hover:underline font-medium">Entre</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);

  registerForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.registerForm.value;

      this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
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
}
