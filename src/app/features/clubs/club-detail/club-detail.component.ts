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
import { ClubResponse, ClubMemberResponse } from '../../../core/models/club.model';
import { EventResponse } from '../../../core/models/event.model';
import { RankingEntryResponse } from '../../../core/models/ranking.model';
import { PostResponse } from '../../../core/models/post.model';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-neutral-100 pt-24 pb-12 px-4 md:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        @if (club()) {
          <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h1 class="text-4xl md:text-5xl font-bold font-sora mb-2">{{ club()!.name }}</h1>
                <p class="text-neutral-400 text-lg max-w-2xl">{{ club()!.description }}</p>
                <div class="flex items-center gap-2 mt-3 text-sm text-neutral-500">
                  <span>Criado por {{ club()!.owner.name }}</span>
                </div>
              </div>

              @if (isAdmin()) {
                <button
                  (click)="generateInvite()"
                  class="bg-[#FFC250] text-[#0f0f1a] px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all whitespace-nowrap min-h-[44px]"
                >
                  Gerar Convite
                </button>
              }
            </div>
          </div>
        }

        <div class="flex overflow-x-auto border-b border-white/10 mb-8 pb-2 gap-8 no-scrollbar">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="activeTab.set(tab.id)"
              [class.border-[#FFC250]]="activeTab() === tab.id"
              [class.text-[#FFC250]]="activeTab() === tab.id"
              class="pb-2 text-lg font-semibold font-sora border-b-2 border-transparent text-neutral-400 hover:text-neutral-200 transition-colors whitespace-nowrap px-2 min-h-[44px]"
            >
              {{ tab.label }}
            </button>
          }
        </div>

        @switch (activeTab()) {
          @case ('events') {
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Eventos</h2>
            </div>
            @if (events().length === 0) {
              <div class="text-center py-16 text-neutral-500">Nenhum evento neste clube ainda.</div>
            } @else {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (event of events(); track event.id) {
                  <div
                    class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#FFC250]/50 transition-colors"
                    (click)="router.navigate(['/events', event.id])"
                  >
                    <div
                      class="h-40 bg-gradient-to-br from-[#2B4393]/30 to-[#0f0f1a] relative flex items-center justify-center"
                    >
                      @if (event.posterUrl) {
                        <img
                          [src]="event.posterUrl"
                          [alt]="event.movieTitle"
                          class="w-full h-full object-cover"
                        />
                      } @else {
                        <span class="text-5xl opacity-30">🎬</span>
                      }
                      <div
                        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                        [ngClass]="{
                          'bg-green-500/20 text-green-400 border border-green-500/50':
                            event.status === 'OPEN',
                          'bg-blue-500/20 text-blue-400 border border-blue-500/50':
                            event.status === 'SETTLED',
                          'bg-red-500/20 text-red-400 border border-red-500/50':
                            event.status === 'CANCELLED',
                        }"
                      >
                        {{
                          event.status === 'OPEN'
                            ? 'Aberto'
                            : event.status === 'SETTLED'
                              ? 'Finalizado'
                              : 'Cancelado'
                        }}
                      </div>
                    </div>
                    <div class="p-5">
                      <h3 class="text-xl font-bold mb-1">{{ event.movieTitle }}</h3>
                      <p class="text-sm text-neutral-400 mb-2">
                        {{ event.cinemaName }} •
                        {{ event.sessionDateTime | date: 'dd/MM/yyyy HH:mm' }}
                      </p>
                      <div class="text-xs text-neutral-500 mt-4 flex items-center gap-2">
                        <span>Organizado por:</span>
                        <span class="text-neutral-300 font-semibold">{{
                          event.organizer.name
                        }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          }

          @case ('members') {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              @for (member of members(); track member.membershipId) {
                <div
                  class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-[#2B4393] flex items-center justify-center font-bold text-white"
                    >
                      {{ member.user.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="font-bold flex items-center gap-2">
                        {{ member.user.name }}
                        @if (member.role === 'ADMIN') {
                          <span
                            class="text-[10px] bg-[#FFC250] text-[#0f0f1a] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                            >Admin</span
                          >
                        }
                      </div>
                      <div class="text-xs text-neutral-400">Score: {{ member.clubScore }}</div>
                    </div>
                  </div>
                  @if (isAdmin() && member.role !== 'ADMIN') {
                    <button
                      (click)="removeMember(member.user.id)"
                      class="text-neutral-500 hover:text-red-400 transition-colors p-2"
                      aria-label="Remover membro"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  }
                </div>
              }
            </div>
          }

          @case ('ranking') {
            <div class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              @if (ranking().length === 0) {
                <div class="text-center py-16 text-neutral-500">Nenhuma pontuação ainda.</div>
              } @else {
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-black/20 text-neutral-400 text-sm">
                      <th class="p-4 font-medium w-16 text-center">Pos</th>
                      <th class="p-4 font-medium">Membro</th>
                      <th class="p-4 font-medium text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rank of ranking(); track rank.userId; let i = $index) {
                      <tr
                        class="border-t border-white/5 hover:bg-white/5 transition-colors"
                        [class.bg-[#FFC250]/5]="rank.userId === currentUserId()"
                      >
                        <td class="p-4 text-center font-bold font-sora">
                          @if (i === 0) {
                            <span class="text-yellow-400 text-xl">🥇</span>
                          } @else if (i === 1) {
                            <span class="text-gray-300 text-xl">🥈</span>
                          } @else if (i === 2) {
                            <span class="text-amber-600 text-xl">🥉</span>
                          } @else {
                            <span class="text-neutral-500">{{ rank.position }}</span>
                          }
                        </td>
                        <td class="p-4">
                          <div class="flex items-center gap-3">
                            <div
                              class="w-8 h-8 rounded-full bg-[#2B4393] flex items-center justify-center text-xs font-bold"
                            >
                              {{ rank.name.charAt(0) }}
                            </div>
                            <span class="font-medium">{{ rank.name }}</span>
                          </div>
                        </td>
                        <td class="p-4 text-right font-bold text-[#FFC250]">
                          {{ rank.clubScore }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }

          @case ('feed') {
            @if (feed().length === 0) {
              <div class="text-center py-16 text-neutral-500">
                Nenhuma memória compartilhada ainda.
              </div>
            } @else {
              <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                @for (post of feed(); track post.id) {
                  <div
                    class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden break-inside-avoid"
                  >
                    <img
                      [src]="post.imageUrl"
                      [alt]="post.caption || 'Memória'"
                      class="w-full object-cover"
                    />
                    <div class="p-4">
                      @if (post.caption) {
                        <p class="text-sm mb-3">{{ post.caption }}</p>
                      }
                      <div class="flex justify-between items-center text-xs text-neutral-400">
                        <span>{{ post.author.name }}</span>
                        <span>{{ post.createdAt | date: 'dd/MM/yyyy' }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          }
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showInviteModal()) {
      <div
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        (click)="showInviteModal.set(false)"
      >
        <div
          class="bg-[#1a1a2e] border border-white/20 rounded-2xl w-full max-w-md p-6 relative"
          (click)="$event.stopPropagation()"
        >
          <h2 class="text-2xl font-bold font-sora mb-4">Convite Gerado</h2>
          <p class="text-neutral-400 text-sm mb-6">
            Compartilhe este link com seus amigos para que eles possam entrar no clube.
          </p>

          <div
            class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10 mb-4"
          >
            <code class="text-[#FFC250] flex-1 font-mono text-sm break-all">{{ inviteUrl() }}</code>
          </div>

          <button
            (click)="copyInvite()"
            class="w-full bg-[#2B4393] hover:bg-[#3d5ac2] text-white py-3 rounded-full font-bold transition-colors min-h-[44px] mb-3"
          >
            {{ copied() ? '✅ Copiado!' : '📋 Copiar Link' }}
          </button>
          <button
            (click)="showInviteModal.set(false)"
            class="w-full bg-white/10 hover:bg-white/20 py-3 rounded-full font-bold transition-colors min-h-[44px]"
          >
            Fechar
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
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

  club = signal<ClubResponse | null>(null);
  activeTab = signal('events');
  isAdmin = signal(false);

  events = signal<EventResponse[]>([]);
  members = signal<ClubMemberResponse[]>([]);
  ranking = signal<RankingEntryResponse[]>([]);
  feed = signal<PostResponse[]>([]);

  showInviteModal = signal(false);
  inviteUrl = signal('');
  copied = signal(false);
  currentUserId = signal<number | null>(null);

  private clubId = 0;

  tabs = [
    { id: 'events', label: 'Eventos' },
    { id: 'members', label: 'Membros' },
    { id: 'ranking', label: 'Ranking' },
    { id: 'feed', label: 'Feed' },
  ];

  ngOnInit(): void {
    this.currentUserId.set(this.authService.currentUser()?.id ?? null);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.clubId = parseInt(id, 10);
        this.loadClubData();
      }
    });
  }

  loadClubData(): void {
    this.clubService.getClubById(this.clubId).subscribe((club) => {
      this.club.set(club);
      this.seoService.updateMeta({
        title: club.name,
        description: club.description || 'Clube no CineCrew',
      });
    });

    this.eventService.getEventsByClub(this.clubId).subscribe((events) => this.events.set(events));

    this.clubService.getMembers(this.clubId).subscribe((members) => {
      this.members.set(members);
      const currentUserId = this.authService.currentUser()?.id;
      const currentMember = members.find((m) => m.user.id === currentUserId);
      this.isAdmin.set(currentMember?.role === 'ADMIN');
    });

    this.rankingService
      .getClubRanking(this.clubId)
      .subscribe((ranking) => this.ranking.set(ranking));
    this.postService
      .getClubFeed(this.clubId, 0, 20)
      .subscribe((page) => this.feed.set(page.content));
  }

  removeMember(userId: number): void {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      this.clubService.removeMember(this.clubId, userId).subscribe({
        next: () => {
          this.members.update((m) => m.filter((member) => member.user.id !== userId));
          this.toastService.success('Membro removido');
        },
      });
    }
  }

  generateInvite(): void {
    this.clubService.createInvite(this.clubId).subscribe((invite) => {
      this.inviteUrl.set(invite.inviteUrl);
      this.showInviteModal.set(true);
      this.copied.set(false);
    });
  }

  copyInvite(): void {
    navigator.clipboard.writeText(this.inviteUrl()).then(() => {
      this.copied.set(true);
      this.toastService.success('Link copiado!');
      setTimeout(() => this.copied.set(false), 3000);
    });
  }
}
