import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-neutral-100 pt-24 pb-12 px-4 md:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h1 class="text-3xl md:text-4xl font-bold font-sora">Meus Clubes</h1>
          <button
            (click)="showCreateModal.set(true)"
            class="bg-[#2B4393] hover:bg-[#3d5ac2] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-[#2B4393]/50 min-h-[44px]"
            aria-label="Criar Clube"
          >
            + Criar Clube
          </button>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white/5 animate-pulse rounded-2xl h-48 border border-white/10"></div>
            }
          </div>
        } @else if (clubs().length === 0) {
          <div
            class="flex flex-col items-center justify-center py-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            <span class="text-6xl mb-4">🎬</span>
            <h2 class="text-2xl font-bold mb-2">Nenhum clube ainda</h2>
            <p class="text-neutral-400 mb-6 text-center max-w-md">
              Crie seu primeiro clube e convide seus amigos para organizar idas ao cinema!
            </p>
            <button
              (click)="showCreateModal.set(true)"
              class="bg-[#FFC250] text-[#0f0f1a] px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all min-h-[44px]"
            >
              Criar Clube
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (club of clubs(); track club.id) {
              <div
                (click)="router.navigate(['/clubs', club.id])"
                class="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 cursor-pointer hover:-translate-y-1 hover:border-[#FFC250]/30 transition-all duration-300 group"
              >
                <h3
                  class="text-xl font-bold font-sora text-[#FFC250] mb-2 group-hover:text-white transition-colors"
                >
                  {{ club.name }}
                </h3>
                @if (club.description) {
                  <p class="text-neutral-400 mb-4 h-12 overflow-hidden text-sm">
                    {{
                      club.description.length > 100
                        ? (club.description | slice: 0 : 100) + '...'
                        : club.description
                    }}
                  </p>
                } @else {
                  <p class="text-neutral-500 mb-4 h-12 text-sm italic">Sem descrição</p>
                }
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-[#2B4393] flex items-center justify-center text-xs font-bold text-white"
                    >
                      {{ club.owner.name.charAt(0) }}
                    </div>
                    <span class="text-sm text-neutral-300">{{ club.owner.name }}</span>
                  </div>
                  <span class="text-xs text-neutral-500">{{
                    club.createdAt | date: 'dd/MM/yyyy'
                  }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showCreateModal()) {
      <div
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        (click)="closeModal()"
      >
        <div
          class="bg-[#1a1a2e] border border-white/20 rounded-2xl w-full max-w-md p-6 relative"
          (click)="$event.stopPropagation()"
        >
          <h2 class="text-2xl font-bold font-sora mb-6">Novo Clube</h2>

          <form [formGroup]="createForm" (ngSubmit)="onCreateClub()">
            <div class="mb-4">
              <label class="block text-sm text-neutral-400 mb-2" for="clubName"
                >Nome do Clube *</label
              >
              <input
                type="text"
                id="clubName"
                formControlName="name"
                class="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250] transition-colors min-h-[44px]"
                placeholder="Ex: Amigos do Cinema"
              />
              @if (createForm.get('name')?.touched && createForm.get('name')?.invalid) {
                <p class="mt-1 text-sm text-red-400">Nome é obrigatório (máx. 100 caracteres).</p>
              }
            </div>

            <div class="mb-6">
              <label class="block text-sm text-neutral-400 mb-2" for="clubDesc"
                >Descrição (opcional)</label
              >
              <textarea
                id="clubDesc"
                formControlName="description"
                rows="3"
                class="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFC250] focus:ring-1 focus:ring-[#FFC250] transition-colors resize-none"
                placeholder="Sobre o que é este clube?"
              ></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button
                type="button"
                (click)="closeModal()"
                class="px-6 py-2 rounded-full text-neutral-400 hover:text-white transition-colors min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="createForm.invalid || creating()"
                class="bg-[#FFC250] text-[#0f0f1a] px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                @if (creating()) {
                  <span
                    class="animate-spin inline-block w-4 h-4 border-2 border-[#0f0f1a]/30 border-t-[#0f0f1a] rounded-full"
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
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ClubListComponent implements OnInit {
  readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly clubService = inject(ClubService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);

  clubs = signal<ClubResponse[]>([]);
  loading = signal(true);
  showCreateModal = signal(false);
  creating = signal(false);

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
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
      error: () => this.loading.set(false),
    });
  }

  closeModal(): void {
    this.showCreateModal.set(false);
    this.createForm.reset();
  }

  onCreateClub(): void {
    if (this.createForm.valid) {
      this.creating.set(true);
      const { name, description } = this.createForm.getRawValue();
      this.clubService.createClub({ name, description }).subscribe({
        next: () => {
          this.toastService.success('Clube criado com sucesso!');
          this.closeModal();
          this.loadClubs();
          this.creating.set(false);
        },
        error: () => this.creating.set(false),
      });
    }
  }
}
