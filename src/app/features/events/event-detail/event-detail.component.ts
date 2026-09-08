import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EventService } from '../../../core/services/event.service';
import { PaymentService } from '../../../core/services/payment.service';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/services/seo.service';
import { EventResponse } from '../../../core/models/event.model';
import {
  EventBalanceResponse,
  ParticipantBalance,
  EventStatus,
} from '../../../core/models/event.model';
import { PostResponse, CreatePostRequest } from '../../../core/models/post.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-neutral-100 pt-24 pb-12 px-4 md:px-8"
    >
      <div class="max-w-6xl mx-auto">
        @if (loading()) {
          <div class="flex justify-center items-center py-32">
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC250]"
              role="status"
              aria-label="Carregando dados do evento..."
            ></div>
          </div>
        } @else if (eventData()) {
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden mb-12 flex flex-col md:flex-row shadow-2xl"
          >
            <div class="md:w-1/3 aspect-[2/3] md:aspect-auto">
              <img
                [src]="eventData()!.posterUrl || 'https://via.placeholder.com/400x600'"
                [alt]="eventData()!.movieTitle"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-8 md:w-2/3 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start gap-4 mb-4">
                  <h1 class="text-4xl md:text-5xl font-bold font-sora">
                    {{ eventData()!.movieTitle }}
                  </h1>
                  <span
                    class="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shrink-0"
                    [ngClass]="{
                      'bg-green-500/20 text-green-400 border border-green-500/50':
                        eventData()!.status === 'OPEN',
                      'bg-blue-500/20 text-blue-400 border border-blue-500/50':
                        eventData()!.status === 'SETTLED',
                      'bg-red-500/20 text-red-400 border border-red-500/50':
                        eventData()!.status === 'CANCELLED',
                    }"
                  >
                    {{
                      eventData()!.status === 'OPEN'
                        ? 'Aberto'
                        : eventData()!.status === 'SETTLED'
                          ? 'Concluído'
                          : 'Cancelado'
                    }}
                  </span>
                </div>

                <div class="flex flex-col gap-3 text-neutral-300 mb-8">
                  <div class="flex items-center gap-3">
                    <span class="text-xl" aria-hidden="true">📅</span>
                    <span
                      >{{ eventData()!.sessionDateTime | date: 'fullDate' }} às
                      {{ eventData()!.sessionDateTime | date: 'shortTime' }}</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xl" aria-hidden="true">📍</span>
                    <span>{{ eventData()!.cinemaName }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xl" aria-hidden="true">👤</span>
                    <span>Organizado por {{ eventData()!.organizer.name }}</span>
                  </div>
                </div>
              </div>

              @if (isAdmin()) {
                <div class="pt-6 border-t border-white/10 flex items-center gap-4">
                  <label for="statusSelect" class="text-sm text-neutral-400 font-medium"
                    >Alterar Status:</label
                  >
                  <select
                    #statusSelect
                    id="statusSelect"
                    (change)="updateStatus(statusSelect.value)"
                    aria-label="Alterar status do evento"
                    class="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFC250] min-h-[44px] cursor-pointer"
                  >
                    <option
                      value="OPEN"
                      class="bg-[#1a1a2e] text-white"
                      [selected]="eventData()!.status === 'OPEN'"
                    >
                      Aberto
                    </option>
                    <option
                      value="SETTLED"
                      class="bg-[#1a1a2e] text-white"
                      [selected]="eventData()!.status === 'SETTLED'"
                    >
                      Concluído
                    </option>
                    <option
                      value="CANCELLED"
                      class="bg-[#1a1a2e] text-white"
                      [selected]="eventData()!.status === 'CANCELLED'"
                    >
                      Cancelado
                    </option>
                  </select>
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 class="text-2xl font-bold font-sora mb-6 flex items-center gap-3">
                <span aria-hidden="true">💰</span> Rachadinha
              </h2>

              <div
                class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6 shadow-xl"
              >
                <div class="flex justify-between items-end mb-4">
                  <div>
                    <p class="text-sm text-neutral-400">Total do Evento</p>
                    <p class="text-3xl font-bold font-sora text-[#FFC250]">
                      {{ totalAmount() | currency: 'BRL' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-neutral-400">Pendente</p>
                    <p class="text-xl font-bold text-red-400">
                      {{ totalPending() | currency: 'BRL' }}
                    </p>
                  </div>
                </div>

                <div class="w-full bg-neutral-800 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                    class="bg-[#FFC250] h-3 rounded-full transition-all duration-1000"
                    [style.width]="
                      (totalAmount() > 0 ? (totalPaid() / totalAmount()) * 100 : 0) + '%'
                    "
                  ></div>
                </div>
                <p class="text-xs text-right text-neutral-400">
                  {{ totalPaid() | currency: 'BRL' }} pago
                </p>
              </div>

              <div class="space-y-4">
                @for (p of participants(); track p.userId) {
                  <div
                    class="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 transition-all hover:border-white/30"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-full bg-[#2B4393] flex items-center justify-center font-bold text-white shrink-0"
                      >
                        {{ p.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="font-bold text-white">{{ p.name }}</p>
                        <p
                          class="text-sm"
                          [class.text-green-400]="p.paymentStatus === 'PAID'"
                          [class.text-red-400]="p.paymentStatus === 'PENDING'"
                          [class.text-neutral-400]="p.paymentStatus === 'CANCELLED'"
                        >
                          {{ p.amountOwed | currency: 'BRL' }} •
                          {{
                            p.paymentStatus === 'PAID'
                              ? 'Pago'
                              : p.paymentStatus === 'CANCELLED'
                                ? 'Cancelado'
                                : 'Pendente'
                          }}
                        </p>
                      </div>
                    </div>
                    @if (isAdmin() && p.paymentStatus === 'PENDING') {
                      <button
                        (click)="confirmPayment(p.userId)"
                        aria-label="Confirmar pagamento de participante"
                        class="text-xs bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-white px-3 py-2 rounded-lg transition-colors min-h-[44px]"
                      >
                        Confirmar
                      </button>
                    }
                  </div>
                }
                @if (participants().length === 0) {
                  <div
                    class="py-8 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl"
                  >
                    Nenhum participante registrado.
                  </div>
                }
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold font-sora flex items-center gap-3">
                  <span aria-hidden="true">📸</span> Memórias
                </h2>
                <button
                  (click)="showPostModal.set(true)"
                  aria-label="Publicar nova memória"
                  class="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors min-h-[44px] flex items-center gap-2"
                >
                  <span>+ Publicar</span>
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4">
                @for (post of posts(); track post.id) {
                  <div
                    class="relative group rounded-xl overflow-hidden aspect-square border border-white/10 bg-white/5"
                  >
                    <img
                      [src]="post.imageUrl || 'https://via.placeholder.com/300'"
                      [alt]="post.caption || 'Memória do evento'"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end"
                    >
                      @if (post.caption) {
                        <p class="text-sm text-white line-clamp-3 mb-2">{{ post.caption }}</p>
                      }
                      <p class="text-xs text-neutral-400 font-bold">{{ post.author.name }}</p>
                    </div>
                  </div>
                }
                @if (posts().length === 0) {
                  <div
                    class="col-span-2 py-12 text-center text-neutral-500 border border-dashed border-white/10 rounded-xl"
                  >
                    Nenhuma memória compartilhada ainda.
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div
            class="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-2xl mx-auto shadow-2xl"
          >
            <span class="text-5xl mb-4 block" aria-hidden="true">🎬</span>
            <h2 class="text-2xl font-bold mb-2">Evento não encontrado</h2>
            <p class="text-neutral-400 mb-6">
              O evento solicitado não existe ou você não tem acesso.
            </p>
            <a
              routerLink="/clubs"
              aria-label="Voltar para clubes"
              class="bg-[#2B4393] text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all inline-block min-h-[44px]"
            >
              Voltar para Clubes
            </a>
          </div>
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showPostModal()) {
      <div
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        (click)="showPostModal.set(false)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-post-title"
      >
        <div
          class="bg-[#1a1a2e] border border-white/20 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
          (click)="$event.stopPropagation()"
        >
          <h3 id="modal-post-title" class="text-xl font-bold font-sora mb-4 text-white">
            Compartilhar Memória
          </h3>

          <div class="mb-4">
            <label for="imgUrl" class="block text-sm text-neutral-400 mb-2">URL da Imagem</label>
            <input
              #imgUrl
              id="imgUrl"
              type="text"
              placeholder="https://exemplo.com/foto.jpg"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FFC250] outline-none min-h-[44px]"
            />
          </div>

          <div class="mb-6">
            <label for="caption" class="block text-sm text-neutral-400 mb-2">Legenda</label>
            <textarea
              #caption
              id="caption"
              rows="3"
              placeholder="Adicione uma legenda sobre a sessão..."
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FFC250] outline-none resize-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              (click)="showPostModal.set(false)"
              aria-label="Cancelar publicação"
              class="px-4 py-2 rounded-full text-neutral-400 hover:text-white transition-colors min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              (click)="createPost(imgUrl.value, caption.value)"
              aria-label="Publicar memória"
              class="bg-[#FFC250] text-[#0f0f1a] font-bold px-6 py-2 rounded-full hover:bg-opacity-90 transition-all min-h-[44px]"
            >
              Publicar
            </button>
          </div>
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
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);
  private readonly paymentService = inject(PaymentService);
  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly seoService = inject(SeoService);

  eventId = 0;
  eventData = signal<EventResponse | null>(null);
  participants = signal<ParticipantBalance[]>([]);
  posts = signal<PostResponse[]>([]);
  loading = signal<boolean>(true);

  totalAmount = signal(0);
  totalPaid = signal(0);
  totalPending = signal(0);

  showPostModal = signal(false);

  isAdmin = computed(() => {
    const event = this.eventData();
    const currentUser = this.authService.currentUser();
    return !!(event && currentUser && event.organizer.id === currentUser.id);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.eventId = parseInt(id, 10);
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loading.set(true);

    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventData.set(event);
        this.loading.set(false);
        this.seoService.updateMeta({
          title: event.movieTitle,
          description: `Evento CineCrew: ${event.movieTitle} no cinema ${event.cinemaName}`,
          image: event.posterUrl || undefined,
        });
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Erro ao carregar os detalhes do evento.');
      },
    });

    this.loadBalance();
  }

  loadBalance(): void {
    this.paymentService.getBalance(this.eventId).subscribe({
      next: (balance: EventBalanceResponse) => {
        this.participants.set(balance.participants);
        this.totalAmount.set(balance.totalAmount);
        this.totalPaid.set(balance.totalPaid);
        this.totalPending.set(balance.totalPending);
      },
      error: () => {
        this.toastService.error('Erro ao carregar os pagamentos do evento.');
      },
    });
  }

  updateStatus(status: string): void {
    const eventStatus = status as EventStatus;
    this.eventService.updateStatus(this.eventId, { status: eventStatus }).subscribe({
      next: (updatedEvent) => {
        this.eventData.set(updatedEvent);
        this.toastService.success('Status do evento atualizado com sucesso!');
      },
      error: () => {
        this.toastService.error('Erro ao atualizar o status do evento.');
      },
    });
  }

  confirmPayment(userId: number): void {
    this.paymentService.confirmPayment(this.eventId, userId).subscribe({
      next: () => {
        this.toastService.success('Pagamento confirmado com sucesso!');
        this.loadBalance();
      },
      error: () => {
        this.toastService.error('Erro ao confirmar o pagamento.');
      },
    });
  }

  createPost(imageUrl: string, caption: string): void {
    if (!imageUrl || !imageUrl.trim()) {
      this.toastService.warning('Informe a URL da imagem.');
      return;
    }

    const request: CreatePostRequest = {
      imageUrl: imageUrl.trim(),
      caption: caption.trim() || undefined,
    };

    this.postService.createPost(this.eventId, request).subscribe({
      next: (newPost) => {
        this.posts.update((current) => [newPost, ...current]);
        this.showPostModal.set(false);
        this.toastService.success('Memória compartilhada com sucesso!');
      },
      error: () => {
        this.toastService.error('Erro ao publicar a memória.');
      },
    });
  }
}
