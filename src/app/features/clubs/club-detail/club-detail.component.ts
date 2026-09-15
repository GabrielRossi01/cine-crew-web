import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ClubService } from '../../../core/services/club.service';
import { EventService } from '../../../core/services/event.service';
import { RankingService } from '../../../core/services/ranking.service';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/services/seo.service';
import { ClubMemberResponse, ClubResponse } from '../../../core/models/club.model';
import { EventResponse } from '../../../core/models/event.model';
import { RankingEntryResponse } from '../../../core/models/ranking.model';
import { PostResponse } from '../../../core/models/post.model';

type ClubTab = 'events' | 'members' | 'ranking' | 'feed';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] px-4 pb-12 pt-24 text-neutral-100 md:px-8"
    >
      <div class="mx-auto max-w-7xl">
        @if (club()) {
          <section class="mb-8 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
            <div
              class="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center"
            >
              <div>
                <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC250]">
                  Clube privado
                </p>

                <h1 class="mb-2 font-sora text-4xl font-bold md:text-5xl">
                  {{ club()!.name }}
                </h1>

                <p class="max-w-2xl text-lg text-neutral-400">
                  {{ club()!.description || 'Sua crew de cinema.' }}
                </p>

                <div class="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                  <span>Criado por {{ club()!.owner.name }}</span>
                </div>
              </div>

              @if (isAdmin()) {
                <button
                  type="button"
                  (click)="generateInvite()"
                  class="min-h-[44px] whitespace-nowrap rounded-full bg-[#FFC250] px-6 py-3 font-bold text-[#0f0f1a] transition-all hover:bg-[#ffd477]"
                >
                  Gerar convite
                </button>
              }
            </div>
          </section>
        }

        <div class="no-scrollbar mb-8 flex gap-8 overflow-x-auto border-b border-white/10 pb-2">
          @for (tab of tabs; track tab.id) {
            <button
              type="button"
              (click)="setActiveTab(tab.id)"
              [class.border-[#FFC250]]="activeTab() === tab.id"
              [class.text-[#FFC250]]="activeTab() === tab.id"
              class="min-h-[44px] whitespace-nowrap border-b-2 border-transparent px-2 pb-2 font-sora text-lg font-semibold text-neutral-400 transition-colors hover:text-neutral-200"
            >
              {{ tab.label }}
            </button>
          }
        </div>

        @switch (activeTab()) {
          @case ('events') {
            <section>
              <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-2xl font-bold">Eventos</h2>

                  <p class="mt-1 text-sm text-neutral-400">
                    Organize a próxima sessão da sua crew.
                  </p>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button
                    type="button"
                    (click)="openWatchlist()"
                    class="min-h-[44px] rounded-full border border-[#FFC250]/50 px-5 py-3 text-sm font-bold text-[#FFC250] transition-colors hover:bg-[#FFC250] hover:text-[#0f0f1a]"
                  >
                    Lista de desejos
                  </button>

                  @if (isAdmin()) {
                    <button
                      type="button"
                      (click)="createEvent()"
                      class="min-h-[44px] rounded-full bg-[#FFC250] px-5 py-3 text-sm font-bold text-[#0f0f1a] transition-colors hover:bg-[#ffd477]"
                    >
                      + Criar evento
                    </button>
                  }
                </div>
              </div>

              @if (events().length === 0) {
                <div
                  class="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-neutral-500"
                >
                  <span class="mb-3 block text-5xl">🎬</span>

                  <p>Nenhum evento neste clube ainda.</p>

                  @if (isAdmin()) {
                    <button
                      type="button"
                      (click)="createEvent()"
                      class="mt-5 rounded-full bg-[#FFC250] px-6 py-3 font-bold text-[#0f0f1a]"
                    >
                      Criar primeiro evento
                    </button>
                  }
                </div>
              } @else {
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  @for (event of events(); track event.id) {
                    <article
                      class="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-[#FFC250]/50"
                      (click)="openEvent(event.id)"
                    >
                      <div
                        class="relative flex h-40 items-center justify-center bg-gradient-to-br from-[#2B4393]/30 to-[#0f0f1a]"
                      >
                        @if (event.posterUrl) {
                          <img
                            [src]="event.posterUrl"
                            [alt]="event.movieTitle"
                            class="h-full w-full object-cover"
                          />
                        } @else {
                          <span class="text-5xl opacity-30">🎬</span>
                        }

                        <div
                          class="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold"
                          [ngClass]="eventStatusClass(event.status)"
                        >
                          {{ eventStatusLabel(event.status) }}
                        </div>
                      </div>

                      <div class="p-5">
                        <h3 class="mb-1 text-xl font-bold">
                          {{ event.movieTitle }}
                        </h3>

                        <p class="mb-2 text-sm text-neutral-400">
                          {{ event.cinemaName }} ·
                          {{ event.sessionDateTime | date: 'dd/MM/yyyy HH:mm' }}
                        </p>

                        <div class="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                          <span>Organizado por:</span>

                          <span class="font-semibold text-neutral-300">
                            {{ event.organizer.name }}
                          </span>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              }
            </section>
          }

          @case ('members') {
            <section>
              <h2 class="mb-6 text-2xl font-bold">Membros</h2>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                @for (member of members(); track member.membershipId) {
                  <article
                    class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B4393] font-bold text-white"
                      >
                        {{ member.user.name.charAt(0).toUpperCase() }}
                      </div>

                      <div>
                        <div class="flex items-center gap-2 font-bold">
                          {{ member.user.name }}

                          @if (member.role === 'ADMIN') {
                            <span
                              class="rounded-full bg-[#FFC250] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0f0f1a]"
                            >
                              Admin
                            </span>
                          }
                        </div>

                        <div class="text-xs text-neutral-400">Score: {{ member.clubScore }}</div>
                      </div>
                    </div>

                    @if (isAdmin() && member.role !== 'ADMIN') {
                      <button
                        type="button"
                        (click)="removeMember(member.user.id)"
                        class="p-2 text-neutral-500 transition-colors hover:text-red-400"
                        aria-label="Remover membro"
                      >
                        ✕
                      </button>
                    }
                  </article>
                }
              </div>
            </section>
          }

          @case ('ranking') {
            <section>
              <h2 class="mb-6 text-2xl font-bold">Ranking</h2>

              @if (ranking().length === 0) {
                <div
                  class="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-neutral-500"
                >
                  Nenhuma pontuação ainda.
                </div>
              } @else {
                <div class="mb-8 grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                  @for (rank of topRanking(); track rank.userId) {
                    <div
                      class="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                      [class.md:order-first]="rank.position === 1"
                      [class.md:scale-105]="rank.position === 1"
                      [class.border-[#FFC250]/60]="rank.position === 1"
                    >
                      <div class="mb-3 text-4xl">
                        {{ rankingMedal(rank.position) }}
                      </div>

                      <div
                        class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2B4393] text-xl font-bold"
                      >
                        {{ rank.name.charAt(0).toUpperCase() }}
                      </div>

                      <h3 class="font-bold">{{ rank.name }}</h3>

                      <p class="mt-1 text-sm text-[#FFC250]">{{ rank.clubScore }} pontos</p>
                    </div>
                  }
                </div>

                <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div class="overflow-x-auto">
                    <table class="w-full min-w-[520px] border-collapse text-left">
                      <thead>
                        <tr class="bg-black/20 text-sm text-neutral-400">
                          <th class="w-16 p-4 text-center font-medium">Pos.</th>
                          <th class="p-4 font-medium">Membro</th>
                          <th class="p-4 text-right font-medium">Score</th>
                        </tr>
                      </thead>

                      <tbody>
                        @for (rank of ranking(); track rank.userId; let index = $index) {
                          <tr
                            class="border-t border-white/5 transition-colors hover:bg-white/5"
                            [class.bg-[#FFC250]/5]="rank.userId === currentUserId()"
                          >
                            <td class="p-4 text-center font-bold">
                              {{ rank.position || index + 1 }}
                            </td>

                            <td class="p-4">
                              <div class="flex items-center gap-3">
                                <div
                                  class="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B4393] text-xs font-bold"
                                >
                                  {{ rank.name.charAt(0).toUpperCase() }}
                                </div>

                                <span class="font-medium">
                                  {{ rank.name }}
                                </span>
                              </div>
                            </td>

                            <td class="p-4 text-right font-bold text-[#FFC250]">
                              {{ rank.clubScore }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </section>
          }

          @case ('feed') {
            <section>
              <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-2xl font-bold">Feed</h2>

                  <p class="mt-1 text-sm text-neutral-400">Compartilhe as memórias da sua crew.</p>
                </div>

                <button
                  type="button"
                  (click)="createPost()"
                  class="min-h-[44px] rounded-full bg-[#FFC250] px-5 py-3 text-sm font-bold text-[#0f0f1a] transition-colors hover:bg-[#ffd477]"
                >
                  + Criar post
                </button>
              </div>

              @if (feed().length === 0) {
                <div
                  class="rounded-2xl border border-white/10 bg-white/5 py-16 text-center text-neutral-500"
                >
                  <span class="mb-3 block text-5xl">📸</span>

                  <p>Nenhuma memória compartilhada ainda.</p>

                  <button
                    type="button"
                    (click)="createPost()"
                    class="mt-5 rounded-full border border-[#FFC250]/50 px-6 py-3 font-bold text-[#FFC250]"
                  >
                    Criar primeira memória
                  </button>
                </div>
              } @else {
                <div class="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
                  @for (post of feed(); track post.id) {
                    <article
                      class="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      <img
                        [src]="post.imageUrl"
                        [alt]="post.caption || 'Memória do clube'"
                        class="w-full object-cover"
                        loading="lazy"
                      />

                      <div class="p-4">
                        @if (post.caption) {
                          <p class="mb-3 text-sm">
                            {{ post.caption }}
                          </p>
                        }

                        <div
                          class="flex items-center justify-between gap-3 text-xs text-neutral-400"
                        >
                          <span>{{ post.author.name }}</span>

                          <span>
                            {{ post.createdAt | date: 'dd/MM/yyyy' }}
                          </span>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              }
            </section>
          }
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showInviteModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        (click)="showInviteModal.set(false)"
      >
        <div
          class="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#1a1a2e] p-6"
          (click)="$event.stopPropagation()"
        >
          <h2 class="mb-4 font-sora text-2xl font-bold">Convite gerado</h2>

          <p class="mb-6 text-sm text-neutral-400">
            Compartilhe este link com seus amigos para que eles possam entrar no clube.
          </p>

          <div
            class="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3"
          >
            <code class="flex-1 break-all font-mono text-sm text-[#FFC250]">
              {{ inviteUrl() }}
            </code>
          </div>

          <button
            type="button"
            (click)="copyInvite()"
            class="mb-3 min-h-[44px] w-full rounded-full bg-[#2B4393] py-3 font-bold text-white transition-colors hover:bg-[#3d5ac2]"
          >
            {{ copied() ? '✅ Copiado!' : '📋 Copiar link' }}
          </button>

          <button
            type="button"
            (click)="showInviteModal.set(false)"
            class="min-h-[44px] w-full rounded-full bg-white/10 py-3 font-bold transition-colors hover:bg-white/20"
          >
            Fechar
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
})
export class ClubDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly clubService = inject(ClubService);
  private readonly eventService = inject(EventService);
  private readonly rankingService = inject(RankingService);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly seoService = inject(SeoService);

  readonly club = signal<ClubResponse | null>(null);
  readonly activeTab = signal<ClubTab>('events');
  readonly isAdmin = signal(false);

  readonly events = signal<EventResponse[]>([]);
  readonly members = signal<ClubMemberResponse[]>([]);
  readonly ranking = signal<RankingEntryResponse[]>([]);
  readonly feed = signal<PostResponse[]>([]);

  readonly showInviteModal = signal(false);
  readonly inviteUrl = signal('');
  readonly copied = signal(false);
  readonly currentUserId = signal<number | null>(null);

  readonly tabs: Array<{ id: ClubTab; label: string }> = [
    { id: 'events', label: 'Eventos' },
    { id: 'members', label: 'Membros' },
    { id: 'ranking', label: 'Ranking' },
    { id: 'feed', label: 'Feed' },
  ];

  private clubId = 0;

  ngOnInit(): void {
    this.currentUserId.set(this.authService.currentUser()?.id ?? null);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        return;
      }

      this.clubId = Number.parseInt(id, 10);
      this.loadClubData();
    });
  }

  setActiveTab(tab: ClubTab): void {
    this.activeTab.set(tab);
  }

  loadClubData(): void {
    this.clubService.getClubById(this.clubId).subscribe({
      next: (club) => {
        this.club.set(club);

        this.seoService.updateMeta({
          title: club.name,
          description: club.description || 'Clube no CineCrew',
        });
      },
    });

    this.eventService.getEventsByClub(this.clubId).subscribe({
      next: (events) => this.events.set(events),
    });

    this.clubService.getMembers(this.clubId).subscribe({
      next: (members) => {
        this.members.set(members);

        const currentUserId = this.authService.currentUser()?.id;

        const currentMember = members.find((member) => member.user.id === currentUserId);

        this.isAdmin.set(currentMember?.role === 'ADMIN');
      },
    });

    this.rankingService.getClubRanking(this.clubId).subscribe({
      next: (ranking) => this.ranking.set(ranking),
    });

    this.postService.getClubFeed(this.clubId, 0, 20).subscribe({
      next: (page) => this.feed.set(page.content),
    });
  }

  topRanking(): RankingEntryResponse[] {
    return this.ranking().slice(0, 5);
  }

  rankingMedal(position: number): string {
    if (position === 1) {
      return '🥇';
    }

    if (position === 2) {
      return '🥈';
    }

    if (position === 3) {
      return '🥉';
    }

    return `#${position}`;
  }

  eventStatusLabel(status: string): string {
    if (status === 'OPEN') {
      return 'Aberto';
    }

    if (status === 'SETTLED') {
      return 'Finalizado';
    }

    return 'Cancelado';
  }

  eventStatusClass(status: string): string {
    if (status === 'OPEN') {
      return 'border border-green-500/50 bg-green-500/20 text-green-400';
    }

    if (status === 'SETTLED') {
      return 'border border-blue-500/50 bg-blue-500/20 text-blue-400';
    }

    return 'border border-red-500/50 bg-red-500/20 text-red-400';
  }

  openEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  openWatchlist(): void {
    this.router.navigate(['/watchlist']);
  }

  createEvent(): void {
    this.router.navigate(['/events/new'], {
      queryParams: {
        clubId: this.clubId,
      },
    });
  }

  createPost(): void {
    this.router.navigate(['/clubs', this.clubId, 'posts', 'new']);
  }

  removeMember(userId: number): void {
    const confirmed = window.confirm('Tem certeza que deseja remover este membro?');

    if (!confirmed) {
      return;
    }

    this.clubService.removeMember(this.clubId, userId).subscribe({
      next: () => {
        this.members.update((members) => members.filter((member) => member.user.id !== userId));

        this.toastService.success('Membro removido.');
      },
      error: () => {
        this.toastService.error('Não foi possível remover o membro.');
      },
    });
  }

  generateInvite(): void {
    this.clubService.createInvite(this.clubId).subscribe({
      next: (invite) => {
        this.inviteUrl.set(invite.inviteUrl);
        this.showInviteModal.set(true);
        this.copied.set(false);
      },
      error: () => {
        this.toastService.error('Não foi possível gerar o convite.');
      },
    });
  }

  copyInvite(): void {
    navigator.clipboard
      .writeText(this.inviteUrl())
      .then(() => {
        this.copied.set(true);
        this.toastService.success('Link copiado.');

        setTimeout(() => {
          this.copied.set(false);
        }, 3000);
      })
      .catch(() => {
        this.toastService.error('Não foi possível copiar o link.');
      });
  }
}
