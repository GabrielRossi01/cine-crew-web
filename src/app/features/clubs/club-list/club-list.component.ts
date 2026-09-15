import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ClubService } from '../../../core/services/club.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { ClubResponse } from '../../../core/models/club.model';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] px-4 pb-12 pt-24 text-neutral-100 md:px-8"
    >
      <div class="mx-auto max-w-7xl">
        <div
          class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC250]">
              Sua comunidade
            </p>

            <h1 class="font-sora text-3xl font-bold md:text-4xl">Meus Clubes</h1>

            <p class="mt-2 text-sm text-neutral-400">
              Organize seus rolês e mantenha sua crew por perto.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              (click)="openJoinModal()"
              class="min-h-[44px] rounded-full border border-[#FFC250]/50 px-6 py-3 font-semibold text-[#FFC250] transition-all hover:bg-[#FFC250] hover:text-[#0f0f1a]"
            >
              Entrar em um clube
            </button>

            <button
              type="button"
              (click)="openCreateModal()"
              class="min-h-[44px] rounded-full bg-[#2B4393] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#3d5ac2] hover:shadow-[#2B4393]/50"
              aria-label="Criar clube"
            >
              + Criar clube
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (item of skeletons; track item) {
              <div class="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/5"></div>
            }
          </div>
        } @else if (clubs().length === 0) {
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-20 text-center backdrop-blur-xl"
          >
            <span class="mb-4 text-6xl">🎬</span>

            <h2 class="mb-2 text-2xl font-bold">Nenhum clube ainda</h2>

            <p class="mb-6 max-w-md text-neutral-400">
              Crie seu primeiro clube ou entre em um grupo usando um convite.
            </p>

            <div class="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                (click)="openJoinModal()"
                class="min-h-[44px] rounded-full border border-[#FFC250]/50 px-6 py-3 font-semibold text-[#FFC250]"
              >
                Entrar com convite
              </button>

              <button
                type="button"
                (click)="openCreateModal()"
                class="min-h-[44px] rounded-full bg-[#FFC250] px-8 py-3 font-bold text-[#0f0f1a] transition-all hover:bg-[#ffd477]"
              >
                Criar clube
              </button>
            </div>
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (club of clubs(); track club.id) {
              <article
                (click)="openClub(club.id)"
                class="group cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC250]/30"
              >
                <h2
                  class="mb-2 font-sora text-xl font-bold text-[#FFC250] transition-colors group-hover:text-white"
                >
                  {{ club.name }}
                </h2>

                @if (club.description) {
                  <p class="mb-4 h-12 overflow-hidden text-sm text-neutral-400">
                    {{
                      club.description.length > 100
                        ? (club.description | slice: 0 : 100) + '...'
                        : club.description
                    }}
                  </p>
                } @else {
                  <p class="mb-4 h-12 text-sm italic text-neutral-500">Sem descrição</p>
                }

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B4393] text-xs font-bold text-white"
                    >
                      {{ club.owner.name.charAt(0).toUpperCase() }}
                    </div>

                    <span class="text-sm text-neutral-300">
                      {{ club.owner.name }}
                    </span>
                  </div>

                  <span class="text-xs text-neutral-500">
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Criar clube"
        (click)="closeModal()"
      >
        <div
          class="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#1a1a2e] p-6"
          (click)="$event.stopPropagation()"
        >
          <h2 class="mb-6 font-sora text-2xl font-bold">Novo clube</h2>

          <form [formGroup]="createForm" (ngSubmit)="onCreateClub()">
            <div class="mb-4">
              <label class="mb-2 block text-sm text-neutral-400" for="clubName">
                Nome do clube *
              </label>

              <input
                id="clubName"
                type="text"
                formControlName="name"
                class="min-h-[44px] w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-neutral-500 transition-colors focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250]"
                placeholder="Ex: Amigos do Cinema"
              />

              @if (createForm.get('name')?.touched && createForm.get('name')?.invalid) {
                <p class="mt-1 text-sm text-red-400">
                  Nome é obrigatório e deve ter no máximo 100 caracteres.
                </p>
              }
            </div>

            <div class="mb-6">
              <label class="mb-2 block text-sm text-neutral-400" for="clubDescription">
                Descrição
              </label>

              <textarea
                id="clubDescription"
                formControlName="description"
                rows="3"
                class="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-neutral-500 transition-colors focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250]"
                placeholder="Sobre o que é este clube?"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button
                type="button"
                (click)="closeModal()"
                class="min-h-[44px] rounded-full px-6 py-2 text-neutral-400 transition-colors hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                [disabled]="createForm.invalid || creating()"
                class="min-h-[44px] rounded-full bg-[#FFC250] px-6 py-2 font-bold text-[#0f0f1a] transition-all hover:bg-[#ffd477] disabled:cursor-not-allowed disabled:opacity-50"
              >
                @if (creating()) {
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0f0f1a]/30 border-t-[#0f0f1a]"
                  ></span>
                } @else {
                  Criar
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }

    @if (showJoinModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Entrar em um clube"
        (click)="closeModal()"
      >
        <div
          class="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#1a1a2e] p-6"
          (click)="$event.stopPropagation()"
        >
          <h2 class="mb-2 font-sora text-2xl font-bold">Entrar em um clube</h2>

          <p class="mb-6 text-sm text-neutral-400">
            Cole o link ou código de convite enviado por alguém da sua crew.
          </p>

          <form [formGroup]="joinForm" (ngSubmit)="onJoinClub()">
            <label for="inviteCode" class="mb-2 block text-sm text-neutral-400">
              Link ou código do convite
            </label>

            <input
              id="inviteCode"
              type="text"
              formControlName="inviteCode"
              class="mb-6 min-h-[44px] w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none placeholder-neutral-500 transition-colors focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250]"
            />

            @if (joinForm.get('inviteCode')?.touched && joinForm.get('inviteCode')?.invalid) {
              <p class="mb-4 text-sm text-red-400">Informe um código ou link de convite.</p>
            }

            <div class="flex justify-end gap-4">
              <button
                type="button"
                (click)="closeModal()"
                class="min-h-[44px] rounded-full px-6 py-2 text-neutral-400 transition-colors hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                [disabled]="joinForm.invalid || joining()"
                class="min-h-[44px] rounded-full bg-[#FFC250] px-6 py-2 font-bold text-[#0f0f1a] transition-all hover:bg-[#ffd477] disabled:cursor-not-allowed disabled:opacity-50"
              >
                @if (joining()) {
                  <span
                    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0f0f1a]/30 border-t-[#0f0f1a]"
                  ></span>
                } @else {
                  Entrar
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
  `,
})
export class ClubListComponent implements OnInit {
  readonly router = inject(Router);

  private readonly fb = inject(FormBuilder);
  private readonly clubService = inject(ClubService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);

  readonly clubs = signal<ClubResponse[]>([]);
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

  loadClubs(): void {
    this.loading.set(true);

    this.clubService.getMyClubs().subscribe({
      next: (clubs) => {
        this.clubs.set(clubs);
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
          this.toastService.success('Clube criado com sucesso!');

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
