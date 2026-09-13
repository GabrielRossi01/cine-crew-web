import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ArrowLeft,
  Check,
  ImageOff,
  LoaderCircle,
  LucideAngularModule,
  Save,
} from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      class="min-h-screen bg-[var(--cc-bg-base)] px-5 pb-16 pt-28 text-[var(--cc-text-primary)] sm:px-8"
    >
      <section class="mx-auto max-w-3xl">
        <a
          routerLink="/"
          class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cc-text-muted)] transition-colors hover:text-[var(--cc-text-primary)]"
        >
          <lucide-icon [img]="ArrowLeft" [size]="16" strokeWidth="1.8"></lucide-icon>

          Voltar para o início
        </a>

        <div class="mb-8">
          <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC250]">
            Minha conta
          </p>

          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Meu perfil</h1>

          <p class="mt-3 max-w-xl text-sm leading-6 text-[var(--cc-text-secondary)]">
            Atualize suas informações para personalizar sua experiência no CineCrew.
          </p>
        </div>

        @if (isLoading()) {
          <div
            class="flex items-center gap-3 rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-bg-card)] p-6"
          >
            <lucide-icon
              [img]="LoaderCircle"
              [size]="20"
              strokeWidth="1.8"
              class="animate-spin"
            ></lucide-icon>

            <span class="text-sm text-[var(--cc-text-secondary)]"> Carregando perfil... </span>
          </div>
        } @else {
          <div class="space-y-6">
            <section class="profile-card">
              <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div class="profile-avatar">
                  @if (profile()?.avatarUrl) {
                    <img
                      [src]="profile()?.avatarUrl!"
                      [alt]="profile()?.name ?? 'Foto de perfil'"
                    />
                  } @else {
                    {{ initials() }}
                  }
                </div>

                <div class="flex-1">
                  <h2 class="text-lg font-bold">Foto de perfil</h2>

                  <p class="mt-1 text-sm leading-6 text-[var(--cc-text-muted)]">
                    A foto atual é fornecida pelo cadastro ou pelo login com Google.
                  </p>

                  @if (profile()?.avatarUrl) {
                    <button
                      type="button"
                      class="remove-avatar-button mt-4"
                      [disabled]="isRemovingAvatar()"
                      (click)="removeAvatar()"
                    >
                      @if (isRemovingAvatar()) {
                        <lucide-icon
                          [img]="LoaderCircle"
                          [size]="15"
                          strokeWidth="1.8"
                          class="animate-spin"
                        ></lucide-icon>
                      } @else {
                        <lucide-icon [img]="ImageOff" [size]="15" strokeWidth="1.8"></lucide-icon>
                      }

                      Remover foto
                    </button>
                  }
                </div>
              </div>
            </section>

            <section class="profile-card">
              <form class="space-y-5" (ngSubmit)="saveProfile()">
                <div>
                  <label for="name" class="form-label"> Nome </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autocomplete="name"
                    class="form-input"
                    [(ngModel)]="form.name"
                    maxlength="120"
                    required
                  />
                </div>

                <div>
                  <label for="username" class="form-label"> Username </label>

                  <div class="relative">
                    <span class="username-prefix">@</span>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      autocomplete="username"
                      class="form-input pl-9"
                      [(ngModel)]="form.username"
                      maxlength="30"
                      minlength="3"
                      pattern="[a-zA-Z0-9._-]+"
                      required
                    />
                  </div>

                  <p class="form-hint">Use letras, números, ponto, hífen ou underscore.</p>
                </div>

                <div>
                  <label for="email" class="form-label"> E-mail </label>

                  <input
                    id="email"
                    type="email"
                    class="form-input form-input-disabled"
                    [value]="profile()?.email ?? ''"
                    disabled
                  />

                  <p class="form-hint">O e-mail não pode ser alterado nesta versão.</p>
                </div>

                @if (errorMessage()) {
                  <div class="feedback feedback-error">
                    {{ errorMessage() }}
                  </div>
                }

                @if (successMessage()) {
                  <div class="feedback feedback-success">
                    <lucide-icon [img]="Check" [size]="16" strokeWidth="2"></lucide-icon>

                    {{ successMessage() }}
                  </div>
                }

                <div class="flex justify-end border-t border-[var(--cc-border-subtle)] pt-5">
                  <button type="submit" class="save-button" [disabled]="isSaving()">
                    @if (isSaving()) {
                      <lucide-icon
                        [img]="LoaderCircle"
                        [size]="16"
                        strokeWidth="1.8"
                        class="animate-spin"
                      ></lucide-icon>

                      Salvando...
                    } @else {
                      <lucide-icon [img]="Save" [size]="16" strokeWidth="1.8"></lucide-icon>

                      Salvar alterações
                    }
                  </button>
                </div>
              </form>
            </section>
          </div>
        }
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .profile-card {
      border: 1px solid var(--cc-border-subtle);
      border-radius: 1rem;
      background: var(--cc-bg-card);
      padding: 1.25rem;
      box-shadow: var(--cc-shadow-card);
    }

    .profile-avatar {
      display: flex;
      width: 5.5rem;
      height: 5.5rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 2px solid rgba(255, 194, 80, 0.75);
      border-radius: 9999px;
      color: #111827;
      background: #ffc250;
      font-size: 1.45rem;
      font-weight: 800;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .form-label {
      display: block;
      margin-bottom: 0.45rem;
      color: var(--cc-text-primary);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .form-input {
      display: block;
      width: 100%;
      min-height: 2.75rem;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 0.65rem;
      outline: none;
      padding: 0 0.8rem;
      color: var(--cc-text-primary);
      background: var(--cc-bg-elevated);
      font-size: 0.875rem;
      transition:
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .form-input:focus {
      border-color: #ffc250;
      box-shadow: 0 0 0 3px rgba(255, 194, 80, 0.16);
    }

    .form-input-disabled {
      cursor: not-allowed;
      opacity: 0.65;
    }

    .form-hint {
      margin-top: 0.4rem;
      color: var(--cc-text-muted);
      font-size: 0.7rem;
      line-height: 1.4;
    }

    .username-prefix {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      z-index: 1;
      color: var(--cc-text-muted);
      font-size: 0.875rem;
      transform: translateY(-50%);
    }

    .remove-avatar-button,
    .save-button {
      display: inline-flex;
      min-height: 2.5rem;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      border-radius: 0.6rem;
      font-size: 0.8rem;
      font-weight: 700;
      transition:
        background-color 180ms ease,
        color 180ms ease,
        opacity 180ms ease;
    }

    .remove-avatar-button {
      padding: 0 0.75rem;
      color: #fca5a5;
      background: rgba(127, 29, 29, 0.12);
    }

    .remove-avatar-button:hover {
      background: rgba(127, 29, 29, 0.22);
    }

    .save-button {
      padding: 0 1rem;
      color: #111827;
      background: #ffc250;
    }

    .save-button:hover {
      background: #ffd477;
    }

    .remove-avatar-button:disabled,
    .save-button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .feedback {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      border-radius: 0.6rem;
      padding: 0.7rem 0.8rem;
      font-size: 0.8rem;
    }

    .feedback-error {
      color: #fecaca;
      background: rgba(127, 29, 29, 0.18);
    }

    .feedback-success {
      color: #bbf7d0;
      background: rgba(20, 83, 45, 0.18);
    }
  `,
})
export class ProfileComponent {
  readonly ArrowLeft = ArrowLeft;
  readonly Check = Check;
  readonly ImageOff = ImageOff;
  readonly LoaderCircle = LoaderCircle;
  readonly Save = Save;

  readonly profile = signal<UserProfile | null>(null);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isRemovingAvatar = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = {
    name: '',
    username: '',
  };

  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  constructor() {
    this.loadProfile();
  }

  saveProfile(): void {
    this.clearFeedback();

    const name = this.form.name.trim();
    const username = this.form.username.trim().toLowerCase();

    if (!name || !username) {
      this.errorMessage.set('Preencha o nome e o username.');
      return;
    }

    this.isSaving.set(true);

    this.userService
      .updateMyProfile({
        name,
        username,
      })
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.form.name = profile.name;
          this.form.username = profile.username;

          this.authService.setCurrentUser({
            id: profile.id,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
          });

          this.isSaving.set(false);
          this.successMessage.set('Perfil atualizado com sucesso.');
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  removeAvatar(): void {
    this.clearFeedback();
    this.isRemovingAvatar.set(true);

    this.userService.removeAvatar().subscribe({
      next: () => {
        const currentProfile = this.profile();

        if (currentProfile) {
          const updatedProfile: UserProfile = {
            ...currentProfile,
            avatarUrl: null,
          };

          this.profile.set(updatedProfile);

          this.authService.setCurrentUser({
            id: updatedProfile.id,
            name: updatedProfile.name,
            avatarUrl: null,
          });
        }

        this.isRemovingAvatar.set(false);
        this.successMessage.set('Foto de perfil removida.');
      },
      error: (error) => {
        this.isRemovingAvatar.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  initials(): string {
    const name = this.profile()?.name?.trim();

    if (!name) {
      return 'CC';
    }

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  private loadProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.form.name = profile.name;
        this.form.username = profile.username;
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(error));
      },
    });
  }

  private clearFeedback(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private getErrorMessage(error: any): string {
    if (error?.status === 409) {
      return 'Este username já está sendo utilizado.';
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
