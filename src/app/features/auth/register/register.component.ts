import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main
      class="register-page min-h-screen bg-[var(--cc-bg-base)] px-5 py-8 text-[var(--cc-text-primary)] sm:px-8"
    >
      <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header class="flex items-center justify-between">
          <a
            routerLink="/"
            class="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)]"
            aria-label="CineCrew - Página inicial"
          >
            <img src="cine-crew-logo.svg" alt="CineCrew" class="h-9 w-auto object-contain" />
          </a>
        </header>

        <section class="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center py-12">
          <div class="text-center">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
              Comece seu próximo rolê
            </span>

            <h1
              class="mt-3 font-sora text-3xl font-semibold tracking-[-0.04em] text-[var(--cc-text-primary)] sm:text-4xl"
            >
              Crie sua conta CineCrew
            </h1>

            <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
              Complete seu cadastro passo a passo e reúna sua crew.
            </p>
          </div>

          <div class="mt-10 flex items-center justify-between">
            @for (step of steps; track step.number; let index = $index) {
              <div class="flex items-center" [class.flex-1]="index < steps.length - 1">
                <div class="flex flex-col items-center gap-2">
                  <div
                    class="step-indicator"
                    [class.step-indicator-active]="currentStep() >= step.number"
                    [class.step-indicator-current]="currentStep() === step.number"
                  >
                    @if (currentStep() > step.number) {
                      <span>✓</span>
                    } @else {
                      <span>{{ step.number }}</span>
                    }
                  </div>

                  <span
                    class="hidden text-[10px] font-medium sm:block"
                    [class.text-[#FFC250]]="currentStep() === step.number"
                    [class.text-[var(--cc-text-muted)]]="currentStep() !== step.number"
                  >
                    {{ step.label }}
                  </span>
                </div>

                @if (index < steps.length - 1) {
                  <div
                    class="step-line"
                    [class.step-line-active]="currentStep() > step.number"
                  ></div>
                }
              </div>
            }
          </div>

          <p class="mt-4 text-center text-xs text-[var(--cc-text-muted)] sm:hidden">
            Etapa {{ currentStep() }} de {{ steps.length }} ·
            {{ steps[currentStep() - 1].label }}
          </p>

          <div
            class="mt-8 rounded-2xl border border-[var(--cc-border-default)] bg-[var(--cc-bg-elevated)] p-5 shadow-[var(--cc-shadow-card)] backdrop-blur-2xl sm:p-7"
          >
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              @if (currentStep() === 1) {
                <div class="step-content">
                  <div class="mb-6">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFC250]">
                      Etapa 1
                    </p>

                    <h2 class="mt-2 font-sora text-xl font-semibold text-[var(--cc-text-primary)]">
                      Como podemos chamar você?
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-[var(--cc-text-muted)]">
                      Use o nome pelo qual sua crew conhece você.
                    </p>
                  </div>

                  <label
                    for="name"
                    class="mb-2 block text-sm font-medium text-[var(--cc-text-secondary)]"
                  >
                    Seu nome
                  </label>

                  <input
                    id="name"
                    type="text"
                    formControlName="name"
                    autocomplete="name"
                    class="register-input"
                    placeholder="Ex.: Ana Lima"
                    autofocus
                  />

                  @if (isFieldInvalid('name')) {
                    <p class="form-error">Nome é obrigatório.</p>
                  }

                  <button
                    type="button"
                    class="primary-button mt-6"
                    [disabled]="registerForm.get('name')?.invalid"
                    (click)="nextStep()"
                  >
                    Continuar
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              }

              @if (currentStep() === 2) {
                <div class="step-content">
                  <div class="mb-6">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFC250]">
                      Etapa 2
                    </p>

                    <h2 class="mt-2 font-sora text-xl font-semibold text-[var(--cc-text-primary)]">
                      Onde podemos encontrar você?
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-[var(--cc-text-muted)]">
                      Seu e-mail será usado para acessar sua conta.
                    </p>
                  </div>

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
                    class="register-input"
                    placeholder="seu@email.com"
                    autofocus
                  />

                  @if (isFieldInvalid('email')) {
                    <p class="form-error">Informe um e-mail válido.</p>
                  }

                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" class="secondary-button" (click)="previousStep()">
                      Voltar
                    </button>

                    <button
                      type="button"
                      class="primary-button"
                      [disabled]="registerForm.get('email')?.invalid"
                      (click)="nextStep()"
                    >
                      Continuar
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              }

              @if (currentStep() === 3) {
                <div class="step-content">
                  <div class="mb-6">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFC250]">
                      Etapa 3
                    </p>

                    <h2 class="mt-2 font-sora text-xl font-semibold text-[var(--cc-text-primary)]">
                      Proteja sua conta
                    </h2>

                    <p class="mt-2 text-sm leading-6 text-[var(--cc-text-muted)]">
                      Crie uma senha com pelo menos 8 caracteres.
                    </p>
                  </div>

                  <label
                    for="password"
                    class="mb-2 block text-sm font-medium text-[var(--cc-text-secondary)]"
                  >
                    Senha
                  </label>

                  <input
                    id="password"
                    type="password"
                    formControlName="password"
                    autocomplete="new-password"
                    class="register-input"
                    placeholder="Mínimo de 8 caracteres"
                    autofocus
                  />

                  @if (isFieldInvalid('password')) {
                    <p class="form-error">A senha deve ter no mínimo 8 caracteres.</p>
                  }

                  <label
                    for="confirmPassword"
                    class="mb-2 mt-4 block text-sm font-medium text-[var(--cc-text-secondary)]"
                  >
                    Confirmar senha
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    autocomplete="new-password"
                    class="register-input"
                    placeholder="Digite a senha novamente"
                  />

                  @if (isPasswordMismatch()) {
                    <p class="form-error">As senhas não coincidem.</p>
                  }

                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      class="secondary-button"
                      [disabled]="isLoading()"
                      (click)="previousStep()"
                    >
                      Voltar
                    </button>

                    <button
                      type="submit"
                      class="primary-button"
                      [disabled]="registerForm.invalid || isLoading()"
                    >
                      @if (isLoading()) {
                        <span class="loading-spinner"></span>
                        Criando...
                      } @else {
                        Criar conta
                      }
                    </button>
                  </div>
                </div>
              }
            </form>

            <div class="auth-switch">
              <span> Já tem uma conta? </span>

              <a routerLink="/login" class="auth-switch-link"> Entrar </a>
            </div>
          </div>

          <p class="mt-6 text-center text-xs leading-5 text-[var(--cc-text-muted)]">
            Ao criar sua conta, você poderá organizar clubes, sessões, pagamentos e memórias com sua
            crew.
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

    .register-page {
      min-height: 100vh;
    }

    .step-indicator {
      display: flex;
      width: 1.75rem;
      height: 1.75rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-border-default);
      border-radius: 9999px;
      color: var(--cc-text-muted);
      background: var(--cc-bg-elevated);
      font-size: 0.6875rem;
      font-weight: 700;
      transition:
        border-color 250ms ease,
        color 250ms ease,
        background-color 250ms ease,
        box-shadow 250ms ease;
    }

    .step-indicator-active {
      border-color: #2b4393;
      color: var(--cc-text-primary);
      background: rgba(43, 67, 147, 0.16);
    }

    .step-indicator-current {
      border-color: #ffc250;
      color: #111827;
      background: #ffc250;
      box-shadow: 0 0 18px rgba(255, 194, 80, 0.22);
    }

    .step-line {
      height: 1px;
      flex: 1;
      margin: 0 0.45rem 1.25rem;
      background: var(--cc-border-subtle);
      transition: background-color 250ms ease;
    }

    .step-line-active {
      background: #2b4393;
    }

    .register-input {
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

    .register-input::placeholder {
      color: var(--cc-text-subtle);
    }

    .register-input:focus {
      border-color: #2b4393;
      box-shadow: 0 0 0 3px rgba(43, 67, 147, 0.2);
    }

    .form-error {
      margin-top: 0.4rem;
      color: #f87171;
      font-size: 0.75rem;
      line-height: 1.25rem;
    }

    .auth-switch {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--cc-border-subtle);
      color: var(--cc-text-muted);
      font-size: 0.8rem;
      text-align: center;
    }

    .auth-switch-link {
      color: var(--cc-text-primary);
      font-weight: 700;
      text-decoration: underline;
      text-decoration-color: var(--cc-border-strong);
      text-underline-offset: 0.25rem;
      transition:
        color 180ms ease,
        text-decoration-color 180ms ease;
    }

    .auth-switch-link:hover {
      color: var(--cc-icon-primary);
      text-decoration-color: currentColor;
    }

    .primary-button,
    .secondary-button {
      display: inline-flex;
      min-height: 46px;
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
      width: 100%;
      color: #111827;
      background: #ffc250;
    }

    .primary-button:hover:not(:disabled) {
      background: #ffd477;
      transform: translateY(-1px);
    }

    .primary-button:disabled,
    .secondary-button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .secondary-button {
      border: 1px solid var(--cc-border-default);
      color: var(--cc-text-secondary);
      background: var(--cc-bg-soft);
    }

    .secondary-button:hover:not(:disabled) {
      border-color: var(--cc-border-strong);
      color: var(--cc-text-primary);
      background: var(--cc-bg-elevated);
    }

    .loading-spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(17, 24, 39, 0.25);
      border-top-color: #111827;
      border-radius: 9999px;
      animation: register-spin 700ms linear infinite;
    }

    .step-content {
      animation: register-step-in 250ms ease-out;
    }

    @keyframes register-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes register-step-in {
      from {
        opacity: 0;
        transform: translateX(0.5rem);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .step-indicator,
      .step-line,
      .register-input,
      .auth-switch-link,
      .primary-button,
      .secondary-button,
      .step-content,
      .loading-spinner {
        animation: none;
        transition: none;
      }
    }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly currentStep = signal(1);
  readonly isLoading = signal(false);

  readonly steps = [
    { number: 1, label: 'Seu nome' },
    { number: 2, label: 'Seu e-mail' },
    { number: 3, label: 'Sua senha' },
  ];

  readonly registerForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  nextStep(): void {
    const step = this.currentStep();

    if (!this.isCurrentStepValid()) {
      this.markCurrentStepAsTouched();
      return;
    }

    if (step < this.steps.length) {
      this.currentStep.set(step + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { name, email, password } = this.registerForm.getRawValue();

    this.authService
      .register({
        name: name ?? '',
        email: email ?? '',
        password: password ?? '',
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/clubs']);
        },
        error: (error) => {
          console.error('Erro ao criar conta:', error);
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);

    return Boolean(control?.touched && control.invalid);
  }

  isPasswordMismatch(): boolean {
    const confirmPassword = this.registerForm.get('confirmPassword');

    return Boolean(confirmPassword?.touched && this.registerForm.errors?.['passwordMismatch']);
  }

  private isCurrentStepValid(): boolean {
    const controlsByStep: Record<number, string[]> = {
      1: ['name'],
      2: ['email'],
      3: ['password', 'confirmPassword'],
    };

    const fields = controlsByStep[this.currentStep()];

    return fields.every((fieldName) => {
      const control = this.registerForm.get(fieldName);

      return Boolean(control?.valid);
    });
  }

  private markCurrentStepAsTouched(): void {
    const controlsByStep: Record<number, string[]> = {
      1: ['name'],
      2: ['email'],
      3: ['password', 'confirmPassword'],
    };

    const fields = controlsByStep[this.currentStep()];

    fields.forEach((fieldName) => {
      this.registerForm.get(fieldName)?.markAsTouched();
    });
  }
}
