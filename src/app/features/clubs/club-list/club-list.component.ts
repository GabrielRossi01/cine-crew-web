import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ClubService } from '../../../core/services/club.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClubResponse } from '../../../core/models/club.model';

interface ClubMemberPreview {
  id: number;
  name: string;
  avatarUrl: string | null;
}

interface ClubWithMemberPreview extends ClubResponse {
  members?: ClubMemberPreview[];
  memberCount?: number;
}

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="club-list-page">
      <div class="mx-auto max-w-7xl">
        <header
          class="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <p class="page-eyebrow">Sua comunidade</p>

            <h1 class="page-title">Olá, {{ userName() }}</h1>

            <p class="page-subtitle">Organize seus rolês e mantenha sua crew por perto.</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" (click)="openJoinModal()" class="secondary-action-button">
              Entrar em um clube
            </button>

            <button
              type="button"
              (click)="openCreateModal()"
              class="primary-action-button"
              aria-label="Criar clube"
            >
              + Criar clube
            </button>
          </div>
        </header>

        @if (loading()) {
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (item of skeletons; track item) {
              <div class="club-skeleton"></div>
            }
          </div>
        } @else if (clubs().length === 0) {
          <div class="empty-state">
            <h2 class="empty-state-title">Nenhum clube ainda</h2>

            <p class="empty-state-description">
              Crie seu primeiro clube ou entre em um grupo usando um convite.
            </p>

            <div class="flex flex-wrap justify-center gap-3">
              <button type="button" (click)="openJoinModal()" class="secondary-action-button">
                Entrar com convite
              </button>

              <button type="button" (click)="openCreateModal()" class="primary-action-button">
                Criar clube
              </button>
            </div>
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (club of clubs(); track club.id) {
              <article (click)="openClub(club.id)" class="club-card group">
                <div class="club-card-top">
                  <span class="club-card-label"> Clube privado </span>

                  <span class="club-card-arrow"> → </span>
                </div>

                <h2 class="club-card-title">
                  {{ club.name }}
                </h2>

                @if (club.description) {
                  <p class="club-card-description">
                    {{
                      club.description.length > 100
                        ? (club.description | slice: 0 : 100) + '...'
                        : club.description
                    }}
                  </p>
                } @else {
                  <p class="club-card-description club-card-description-empty">Sem descrição</p>
                }

                <div class="club-card-footer">
                  <div class="club-members-preview">
                    <div class="avatar-stack">
                      @for (member of getMemberPreview(club); track member.id; let index = $index) {
                        <div
                          class="member-avatar"
                          [style.z-index]="10 - index"
                          [attr.title]="member.name"
                        >
                          @if (member.avatarUrl) {
                            <img [src]="member.avatarUrl" [alt]="member.name" loading="lazy" />
                          } @else {
                            {{ getInitials(member.name) }}
                          }
                        </div>
                      }

                      @if (getRemainingMemberCount(club) > 0) {
                        <div class="member-avatar member-avatar-more" [style.z-index]="0">
                          +{{ getRemainingMemberCount(club) }}
                        </div>
                      }
                    </div>

                    <div class="member-summary">
                      <span class="member-summary-label"> Membros </span>

                      <span class="member-summary-count">
                        {{ getMemberCount(club) }}
                      </span>
                    </div>
                  </div>

                  <span class="club-created-date">
                    {{ club.createdAt | date: 'dd/MM/yyyy' }}
                  </span>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showCreateModal()) {
      <div
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Criar clube"
        (click)="closeModal()"
      >
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="modal-eyebrow"> Nova comunidade </span>

              <h2 class="modal-title">Novo clube</h2>
            </div>

            <button
              type="button"
              class="modal-close-button"
              aria-label="Fechar modal"
              (click)="closeModal()"
            >
              ×
            </button>
          </div>

          <form [formGroup]="createForm" (ngSubmit)="onCreateClub()">
            <div class="form-field">
              <label class="form-label" for="clubName"> Nome do clube * </label>

              <input
                id="clubName"
                type="text"
                formControlName="name"
                class="form-input"
                placeholder="Ex: Amigos do Cinema"
              />

              @if (createForm.get('name')?.touched && createForm.get('name')?.invalid) {
                <p class="form-error">Nome é obrigatório e deve ter no máximo 100 caracteres.</p>
              }
            </div>

            <div class="form-field form-field-spaced">
              <label class="form-label" for="clubDescription"> Descrição </label>

              <textarea
                id="clubDescription"
                formControlName="description"
                rows="3"
                class="form-input form-textarea"
                placeholder="Sobre o que é este clube?"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="modal-secondary-button">
                Cancelar
              </button>

              <button
                type="submit"
                [disabled]="createForm.invalid || creating()"
                class="modal-primary-button"
              >
                @if (creating()) {
                  <span class="button-spinner"></span>
                  Criando...
                } @else {
                  Criar clube
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showJoinModal()) {
      <div
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Entrar em um clube"
        (click)="closeModal()"
      >
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="modal-eyebrow"> Convite da crew </span>

              <h2 class="modal-title">Entrar em um clube</h2>
            </div>

            <button
              type="button"
              class="modal-close-button"
              aria-label="Fechar modal"
              (click)="closeModal()"
            >
              ×
            </button>
          </div>

          <p class="modal-description">
            Cole o link ou código de convite enviado por alguém da sua crew.
          </p>

          <form [formGroup]="joinForm" (ngSubmit)="onJoinClub()">
            <div class="form-field form-field-spaced">
              <label for="inviteCode" class="form-label"> Link ou código do convite </label>

              <input
                id="inviteCode"
                type="text"
                formControlName="inviteCode"
                class="form-input"
              />

              @if (joinForm.get('inviteCode')?.touched && joinForm.get('inviteCode')?.invalid) {
                <p class="form-error">Informe um código ou link de convite.</p>
              }
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeModal()" class="modal-secondary-button">
                Cancelar
              </button>

              <button
                type="submit"
                [disabled]="joinForm.invalid || joining()"
                class="modal-primary-button"
              >
                @if (joining()) {
                  <span class="button-spinner"></span>
                  Entrando...
                } @else {
                  Entrar no clube
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .club-list-page {
      min-height: 100vh;
      padding: 6rem 1rem 3rem;
      color: var(--cc-text-primary);
      background: var(--club-list-page-background);
      transition:
        background-color 250ms ease,
        color 250ms ease;
    }

    .page-eyebrow {
      margin-bottom: 0.5rem;
      color: var(--club-list-eyebrow);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .page-title {
      color: var(--cc-text-primary);
      font-family: var(--cc-font-sora, sans-serif);
      font-size: clamp(1.875rem, 4vw, 2.5rem);
      font-weight: 700;
      letter-spacing: -0.04em;
    }

    .page-subtitle {
      margin-top: 0.5rem;
      color: var(--cc-text-secondary);
      font-size: 0.875rem;
    }

    .primary-action-button,
    .secondary-action-button {
      display: inline-flex;
      min-height: 2.75rem;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 700;
      transition:
        background-color 200ms ease,
        border-color 200ms ease,
        color 200ms ease,
        box-shadow 200ms ease,
        transform 200ms ease;
    }

    .primary-action-button {
      color: var(--club-list-primary-text);
      background: var(--club-list-primary-background);
      box-shadow: 0 10px 24px var(--club-list-primary-shadow);
    }

    .primary-action-button:hover {
      background: var(--club-list-primary-hover-background);
      box-shadow: 0 14px 30px var(--club-list-primary-hover-shadow);
      transform: translateY(-1px);
    }

    .secondary-action-button {
      border: 1px solid var(--club-list-secondary-border);
      color: var(--club-list-secondary-text);
      background: var(--club-list-secondary-background);
    }

    .secondary-action-button:hover {
      border-color: var(--club-list-secondary-hover-border);
      color: var(--club-list-secondary-hover-text);
      background: var(--club-list-secondary-hover-background);
      transform: translateY(-1px);
    }

    .club-skeleton {
      height: 12rem;
      border: 1px solid var(--club-list-card-border);
      border-radius: 1rem;
      background: var(--club-list-skeleton-background);
      animation: club-list-pulse 1.6s ease-in-out infinite;
    }

    .club-card {
      position: relative;
      display: flex;
      min-height: 15rem;
      cursor: pointer;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--club-list-card-border);
      border-radius: 1.15rem;
      padding: 1.5rem;
      background: var(--club-list-card-surface);
      box-shadow:
        0 20px 48px var(--club-list-card-shadow),
        inset 0 1px 0 var(--club-list-card-highlight);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition:
        border-color 250ms ease,
        box-shadow 250ms ease,
        transform 250ms ease,
        background-color 250ms ease;
    }

    .club-card::before {
      position: absolute;
      top: -5rem;
      right: -5rem;
      width: 11rem;
      height: 11rem;
      border: 1px solid var(--club-list-card-orbit);
      border-radius: 9999px;
      content: '';
      opacity: 0.55;
      pointer-events: none;
    }

    .club-card::after {
      position: absolute;
      right: 1.5rem;
      bottom: -5rem;
      width: 9rem;
      height: 9rem;
      border: 1px solid var(--club-list-card-orbit);
      border-radius: 9999px;
      content: '';
      opacity: 0.3;
      pointer-events: none;
    }

    .club-card:hover {
      border-color: var(--club-list-card-hover-border);
      box-shadow:
        0 28px 62px var(--club-list-card-hover-shadow),
        inset 0 1px 0 var(--club-list-card-hover-highlight);
      transform: translateY(-5px);
    }

    .club-card-top,
    .club-card-title,
    .club-card-description,
    .club-card-footer {
      position: relative;
      z-index: 1;
    }

    .club-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .club-card-label {
      color: var(--club-list-card-label);
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .club-card-arrow {
      display: flex;
      width: 1.9rem;
      height: 1.9rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--club-list-arrow-border);
      border-radius: 9999px;
      color: var(--club-list-arrow-color);
      background: var(--club-list-arrow-surface);
      opacity: 0.8;
      transition:
        background-color 200ms ease,
        color 200ms ease,
        transform 200ms ease;
    }

    .club-card:hover .club-card-arrow {
      color: var(--club-list-arrow-hover-color);
      background: var(--club-list-arrow-hover-surface);
      transform: translateX(3px);
    }

    .club-card-title {
      margin-top: 1.25rem;
      color: var(--club-list-card-title);
      font-family: var(--cc-font-sora, sans-serif);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      transition: color 200ms ease;
    }

    .club-card:hover .club-card-title {
      color: var(--club-list-card-title-hover);
    }

    .club-card-description {
      min-height: 3.25rem;
      margin-top: 0.55rem;
      overflow: hidden;
      color: var(--cc-text-secondary);
      font-size: 0.8rem;
      line-height: 1.55;
    }

    .club-card-description-empty {
      color: var(--cc-text-muted);
      font-style: italic;
    }

    .club-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 1.2rem;
    }

    .club-members-preview {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 0.7rem;
    }

    .avatar-stack {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      padding-left: 0.4rem;
    }

    .member-avatar {
      position: relative;
      display: flex;
      width: 2rem;
      height: 2rem;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-left: -0.45rem;
      border: 2px solid var(--club-list-avatar-ring);
      border-radius: 9999px;
      color: var(--club-list-avatar-text);
      background: var(--club-list-avatar-surface);
      font-size: 0.62rem;
      font-weight: 800;
      box-shadow: 0 3px 8px var(--club-list-avatar-shadow);
    }

    .member-avatar:first-child {
      margin-left: 0;
    }

    .member-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .member-avatar-more {
      color: var(--club-list-more-text);
      background: var(--club-list-more-surface);
      font-size: 0.58rem;
    }

    .member-summary {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 0.1rem;
    }

    .member-summary-label {
      color: var(--cc-text-muted);
      font-size: 0.62rem;
      line-height: 1;
    }

    .member-summary-count {
      color: var(--cc-text-secondary);
      font-size: 0.7rem;
      font-weight: 700;
    }

    .club-created-date {
      flex-shrink: 0;
      color: var(--cc-text-muted);
      font-size: 0.68rem;
    }

    .empty-state {
      display: flex;
      min-height: 22rem;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--club-list-empty-border);
      border-radius: 1.25rem;
      padding: 5rem 1.5rem;
      background: var(--club-list-empty-surface);
      box-shadow:
        0 20px 48px var(--club-list-empty-shadow),
        inset 0 1px 0 var(--club-list-empty-highlight);
      text-align: center;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .empty-state-icon {
      margin-bottom: 1rem;
      font-size: 3.75rem;
      line-height: 1;
    }

    .empty-state-title {
      color: var(--cc-text-primary);
      font-family: var(--cc-font-sora, sans-serif);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .empty-state-description {
      max-width: 28rem;
      margin: 0.5rem 0 1.5rem;
      color: var(--cc-text-secondary);
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: var(--club-list-modal-backdrop);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .modal-card {
      position: relative;
      width: 100%;
      max-width: 28rem;
      border: 1px solid var(--club-list-modal-border);
      border-radius: 1.15rem;
      padding: 1.5rem;
      color: var(--cc-text-primary);
      background: var(--club-list-modal-surface);
      box-shadow:
        0 28px 80px var(--club-list-modal-shadow),
        inset 0 1px 0 var(--club-list-modal-highlight);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .modal-eyebrow {
      color: var(--club-list-eyebrow);
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .modal-title {
      margin-top: 0.35rem;
      color: var(--cc-text-primary);
      font-family: var(--cc-font-sora, sans-serif);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .modal-description {
      margin: -0.5rem 0 1.5rem;
      color: var(--cc-text-secondary);
      font-size: 0.8rem;
      line-height: 1.55;
    }

    .modal-close-button {
      display: flex;
      width: 2rem;
      height: 2rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--club-list-modal-close-border);
      border-radius: 9999px;
      color: var(--cc-text-muted);
      background: var(--club-list-modal-close-surface);
      font-size: 1.25rem;
      line-height: 1;
      transition:
        background-color 180ms ease,
        color 180ms ease;
    }

    .modal-close-button:hover {
      color: var(--cc-text-primary);
      background: var(--club-list-modal-close-hover-surface);
    }

    .form-field {
      display: block;
    }

    .form-field-spaced {
      margin-top: 1.25rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--cc-text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .form-input {
      display: block;
      width: 100%;
      min-height: 2.75rem;
      resize: none;
      border: 1px solid var(--club-list-input-border);
      border-radius: 0.7rem;
      padding: 0.75rem 1rem;
      color: var(--cc-text-primary);
      background: var(--club-list-input-surface);
      outline: none;
      transition:
        border-color 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease;
    }

    .form-input::placeholder {
      color: var(--cc-text-muted);
    }

    .form-input:focus {
      border-color: var(--club-list-input-focus-border);
      box-shadow: 0 0 0 3px var(--club-list-input-focus-ring);
    }

    .form-textarea {
      min-height: 7rem;
    }

    .form-error {
      margin-top: 0.4rem;
      color: #ef4444;
      font-size: 0.72rem;
      line-height: 1.35;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .modal-primary-button,
    .modal-secondary-button {
      display: inline-flex;
      min-height: 2.75rem;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      border-radius: 9999px;
      padding: 0.75rem 1.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      transition:
        background-color 180ms ease,
        border-color 180ms ease,
        color 180ms ease,
        opacity 180ms ease,
        transform 180ms ease;
    }

    .modal-primary-button {
      color: #111827;
      background: #ffc250;
    }

    .modal-primary-button:hover:not(:disabled) {
      background: #ffd477;
      transform: translateY(-1px);
    }

    .modal-secondary-button {
      color: var(--cc-text-secondary);
      background: transparent;
    }

    .modal-secondary-button:hover {
      color: var(--cc-text-primary);
    }

    .modal-primary-button:disabled,
    .modal-secondary-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .button-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(17, 24, 39, 0.25);
      border-top-color: #111827;
      border-radius: 9999px;
      animation: club-list-spin 700ms linear infinite;
    }

    @keyframes club-list-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes club-list-pulse {
      0%,
      100% {
        opacity: 0.55;
      }

      50% {
        opacity: 1;
      }
    }

    :host-context(.dark) {
      --club-list-page-background: #0a0a0a;
      --club-list-eyebrow: #ffc250;

      --club-list-primary-text: #111827;
      --club-list-primary-background: rgba(255, 194, 80, 0.92);
      --club-list-primary-hover-background: #ffc250;
      --club-list-primary-shadow: rgba(255, 194, 80, 0.12);
      --club-list-primary-hover-shadow: rgba(255, 194, 80, 0.22);

      --club-list-secondary-border: rgba(255, 255, 255, 0.2);
      --club-list-secondary-text: rgba(255, 255, 255, 0.82);
      --club-list-secondary-background: rgba(255, 255, 255, 0.07);
      --club-list-secondary-hover-border: rgba(255, 255, 255, 0.38);
      --club-list-secondary-hover-text: #ffffff;
      --club-list-secondary-hover-background: rgba(255, 255, 255, 0.14);

      --club-list-card-border: rgba(255, 255, 255, 0.14);
      --club-list-card-surface: rgba(255, 255, 255, 0.06);
      --club-list-card-shadow: rgba(0, 0, 0, 0.3);
      --club-list-card-highlight: rgba(255, 255, 255, 0.14);
      --club-list-card-hover-border: rgba(255, 194, 80, 0.5);
      --club-list-card-hover-shadow: rgba(0, 0, 0, 0.42);
      --club-list-card-hover-highlight: rgba(255, 255, 255, 0.2);
      --club-list-card-orbit: rgba(255, 255, 255, 0.08);
      --club-list-card-label: #ffc250;
      --club-list-card-title: #ffc250;
      --club-list-card-title-hover: #ffffff;

      --club-list-arrow-border: rgba(255, 255, 255, 0.16);
      --club-list-arrow-color: rgba(255, 255, 255, 0.68);
      --club-list-arrow-surface: rgba(255, 255, 255, 0.05);
      --club-list-arrow-hover-color: #111827;
      --club-list-arrow-hover-surface: #ffc250;

      --club-list-avatar-ring: #0a0a0a;
      --club-list-avatar-border: rgba(255, 255, 255, 0.16);
      --club-list-avatar-text: #ffffff;
      --club-list-avatar-surface: #2b4393;
      --club-list-avatar-shadow: rgba(0, 0, 0, 0.24);
      --club-list-more-text: #ffc250;
      --club-list-more-surface: rgba(255, 194, 80, 0.12);

      --club-list-skeleton-background: rgba(255, 255, 255, 0.05);
      --club-list-empty-border: rgba(255, 255, 255, 0.16);
      --club-list-empty-surface: rgba(255, 255, 255, 0.06);
      --club-list-empty-shadow: rgba(0, 0, 0, 0.3);
      --club-list-empty-highlight: rgba(255, 255, 255, 0.14);

      --club-list-modal-backdrop: rgba(0, 0, 0, 0.8);
      --club-list-modal-border: rgba(255, 255, 255, 0.16);
      --club-list-modal-surface: #0a0a0a;
      --club-list-modal-shadow: rgba(0, 0, 0, 0.55);
      --club-list-modal-highlight: rgba(255, 255, 255, 0.12);
      --club-list-modal-close-border: rgba(255, 255, 255, 0.12);
      --club-list-modal-close-surface: rgba(255, 255, 255, 0.05);
      --club-list-modal-close-hover-surface: rgba(255, 255, 255, 0.12);

      --club-list-input-border: rgba(255, 255, 255, 0.16);
      --club-list-input-surface: rgba(255, 255, 255, 0.05);
      --club-list-input-focus-border: #ffc250;
      --club-list-input-focus-ring: rgba(255, 194, 80, 0.16);
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --club-list-page-background: var(--cc-bg-base);
      --club-list-eyebrow: #2b4393;

      --club-list-primary-text: #111827;
      --club-list-primary-background: rgba(255, 194, 80, 0.88);
      --club-list-primary-hover-background: #ffc250;
      --club-list-primary-shadow: rgba(43, 67, 147, 0.12);
      --club-list-primary-hover-shadow: rgba(43, 67, 147, 0.2);

      --club-list-secondary-border: rgba(43, 67, 147, 0.2);
      --club-list-secondary-text: #2b4393;
      --club-list-secondary-background: rgba(255, 255, 255, 0.42);
      --club-list-secondary-hover-border: rgba(43, 67, 147, 0.42);
      --club-list-secondary-hover-text: #1e316e;
      --club-list-secondary-hover-background: rgba(43, 67, 147, 0.1);

      --club-list-card-border: rgba(20, 31, 58, 0.16);
      --club-list-card-surface: rgba(255, 255, 255, 0.48);
      --club-list-card-shadow: rgba(34, 48, 78, 0.14);
      --club-list-card-highlight: rgba(255, 255, 255, 0.88);
      --club-list-card-hover-border: rgba(43, 67, 147, 0.42);
      --club-list-card-hover-shadow: rgba(34, 48, 78, 0.22);
      --club-list-card-hover-highlight: rgba(255, 255, 255, 0.96);
      --club-list-card-orbit: rgba(43, 67, 147, 0.12);
      --club-list-card-label: #2b4393;
      --club-list-card-title: #2b4393;
      --club-list-card-title-hover: #1e316e;

      --club-list-arrow-border: rgba(43, 67, 147, 0.16);
      --club-list-arrow-color: #52617d;
      --club-list-arrow-surface: rgba(43, 67, 147, 0.06);
      --club-list-arrow-hover-color: #ffffff;
      --club-list-arrow-hover-surface: #2b4393;

      --club-list-avatar-ring: var(--cc-bg-base);
      --club-list-avatar-border: rgba(43, 67, 147, 0.2);
      --club-list-avatar-text: #ffffff;
      --club-list-avatar-surface: #2b4393;
      --club-list-avatar-shadow: rgba(34, 48, 78, 0.16);
      --club-list-more-text: #2b4393;
      --club-list-more-surface: rgba(43, 67, 147, 0.08);

      --club-list-skeleton-background: rgba(43, 67, 147, 0.08);
      --club-list-empty-border: rgba(20, 31, 58, 0.16);
      --club-list-empty-surface: rgba(255, 255, 255, 0.48);
      --club-list-empty-shadow: rgba(34, 48, 78, 0.14);
      --club-list-empty-highlight: rgba(255, 255, 255, 0.88);

      --club-list-modal-backdrop: rgba(20, 31, 58, 0.38);
      --club-list-modal-border: rgba(20, 31, 58, 0.16);
      --club-list-modal-surface: rgba(255, 255, 255, 0.92);
      --club-list-modal-shadow: rgba(34, 48, 78, 0.24);
      --club-list-modal-highlight: rgba(255, 255, 255, 0.95);
      --club-list-modal-close-border: rgba(20, 31, 58, 0.14);
      --club-list-modal-close-surface: rgba(43, 67, 147, 0.05);
      --club-list-modal-close-hover-surface: rgba(43, 67, 147, 0.1);

      --club-list-input-border: rgba(20, 31, 58, 0.16);
      --club-list-input-surface: rgba(255, 255, 255, 0.62);
      --club-list-input-focus-border: #2b4393;
      --club-list-input-focus-ring: rgba(43, 67, 147, 0.14);
    }

    @media (max-width: 639px) {
      .club-list-page {
        padding: 6rem 1rem 3rem;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .modal-primary-button,
      .modal-secondary-button {
        width: 100%;
      }

      .club-card-footer {
        align-items: flex-end;
      }

      .member-summary {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .primary-action-button,
      .secondary-action-button,
      .club-card,
      .club-card-arrow,
      .modal-close-button,
      .form-input,
      .modal-primary-button,
      .modal-secondary-button,
      .button-spinner,
      .club-skeleton {
        animation: none;
        transition: none;
      }
    }

    @supports not (backdrop-filter: blur(1px)) {
      .club-card,
      .empty-state,
      .modal-card {
        background: var(--club-list-fallback-surface);
      }
    }

    :host-context(.dark) {
       --club-list-fallback-surface: #0a0a0a;
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --club-list-fallback-surface: rgba(255, 255, 255, 0.82);
    }
  `,
})
export class ClubListComponent implements OnInit {
  readonly router = inject(Router);

  private readonly fb = inject(FormBuilder);
  private readonly clubService = inject(ClubService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  readonly clubs = signal<ClubWithMemberPreview[]>([]);
  readonly loading = signal(true);
  readonly showCreateModal = signal(false);
  readonly showJoinModal = signal(false);
  readonly creating = signal(false);
  readonly joining = signal(false);

  readonly skeletons = [1, 2, 3];

  readonly createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  readonly joinForm = this.fb.nonNullable.group({
    inviteCode: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Meus Clubes',
      description: 'Gerencie seus clubes de cinema no CineCrew.',
    });

    this.loadClubs();
  }

  userName(): string {
    const name = this.authService.currentUser()?.name?.trim();

    if (!name) {
      return 'crew';
    }

    return name.split(/\s+/)[0];
  }

  loadClubs(): void {
    this.loading.set(true);

    this.clubService.getMyClubs().subscribe({
      next: (clubs) => {
        this.clubs.set(clubs as ClubWithMemberPreview[]);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);

        this.toastService.error('Não foi possível carregar seus clubes.');
      },
    });
  }

  openClub(clubId: number): void {
    this.router.navigate(['/clubs', clubId]);
  }

  openCreateModal(): void {
    this.showJoinModal.set(false);
    this.showCreateModal.set(true);
  }

  openJoinModal(): void {
    this.showCreateModal.set(false);
    this.showJoinModal.set(true);
  }

  closeModal(): void {
    this.showCreateModal.set(false);
    this.showJoinModal.set(false);

    this.createForm.reset();
    this.joinForm.reset();
  }

  getMemberPreview(club: ClubWithMemberPreview): ClubMemberPreview[] {
    const members = club.members ?? [];

    if (members.length > 0) {
      return members.slice(0, 5);
    }

    return [
      {
        id: club.owner.id,
        name: club.owner.name,
        avatarUrl: club.owner.avatarUrl ?? null,
      },
    ];
  }

  getMemberCount(club: ClubWithMemberPreview): number {
    if (club.memberCount != null) {
      return club.memberCount;
    }

    if (club.members?.length) {
      return club.members.length;
    }

    return 1;
  }

  getRemainingMemberCount(club: ClubWithMemberPreview): number {
    return Math.max(this.getMemberCount(club) - this.getMemberPreview(club).length, 0);
  }

  getInitials(name: string): string {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return 'CC';
    }

    return normalizedName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  onCreateClub(): void {
    if (this.createForm.invalid || this.creating()) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.creating.set(true);

    const { name, description } = this.createForm.getRawValue();

    this.clubService
      .createClub({
        name: name.trim(),
        description: description.trim(),
      })
      .subscribe({
        next: () => {
          this.closeModal();
          this.creating.set(false);
          this.loadClubs();
        },
        error: () => {
          this.creating.set(false);

          this.toastService.error('Não foi possível criar o clube.');
        },
      });
  }

  onJoinClub(): void {
    if (this.joinForm.invalid || this.joining()) {
      this.joinForm.markAllAsTouched();
      return;
    }

    this.joining.set(true);

    const rawInvite = this.joinForm.getRawValue().inviteCode.trim();

    const inviteCode = this.extractInviteCode(rawInvite);

    this.clubService.joinClub(inviteCode).subscribe({
      next: (club) => {
        this.joining.set(false);
        this.closeModal();

        this.toastService.success('Você entrou no clube com sucesso!');

        this.router.navigate(['/clubs', club.id]);
      },
      error: (error) => {
        this.joining.set(false);

        if (error?.status === 409) {
          this.toastService.error('Você já faz parte deste clube.');

          return;
        }

        this.toastService.error('Convite inválido ou expirado.');
      },
    });
  }

  private extractInviteCode(value: string): string {
    try {
      const url = new URL(value);

      const segments = url.pathname.split('/').filter(Boolean);

      return segments.at(-1) ?? value;
    } catch {
      return value;
    }
  }
}
