import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieService } from '../../core/services/movie.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { WatchlistItemResponse } from '../../core/models/watchlist.model';
import { MovieSearchResult } from '../../core/models/movie.model';

interface WatchlistPage {
  content: WatchlistItemResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] px-4 pb-12 pt-24 text-neutral-100 md:px-8"
    >
      <div class="mx-auto max-w-7xl">
        <div
          class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC250]">
              Seus filmes
            </p>

            <h1 class="font-sora text-3xl font-bold md:text-4xl">Lista de Desejos</h1>

            <p class="mt-2 text-sm text-neutral-400">Salve filmes para assistir com sua crew.</p>
          </div>

          <button
            type="button"
            (click)="openSearchModal()"
            class="min-h-[44px] rounded-full bg-[#FFC250] px-6 py-3 font-bold text-[#0f0f1a] shadow-lg transition-all hover:bg-[#ffd477] hover:shadow-[#FFC250]/30"
          >
            + Adicionar filme
          </button>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            @for (item of skeletons; track item) {
              <div
                class="aspect-[2/3] animate-pulse rounded-2xl border border-white/10 bg-white/5"
              ></div>
            }
          </div>
        } @else if (items().length === 0) {
          <div
            class="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-20 text-center backdrop-blur-xl"
          >
            <span class="mb-4 text-6xl" aria-hidden="true">🍿</span>

            <h2 class="mb-2 text-2xl font-bold">Sua lista está vazia</h2>

            <p class="mb-6 max-w-md text-neutral-400">
              Adicione filmes que você deseja assistir com seus amigos e clubes.
            </p>

            <button
              type="button"
              (click)="openSearchModal()"
              class="min-h-[44px] rounded-full bg-[#FFC250] px-8 py-3 font-bold text-[#0f0f1a] transition-all hover:bg-[#ffd477]"
            >
              Explorar filmes
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            @for (item of items(); track item.id) {
              <article
                class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:scale-[1.02] hover:border-white/30"
              >
                @if (item.movie.posterUrl) {
                  <img
                    [src]="item.movie.posterUrl"
                    [alt]="item.movie.title"
                    class="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                } @else {
                  <div
                    class="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-[#2B4393]/30 to-[#0f0f1a]"
                  >
                    <span class="text-5xl opacity-30" aria-hidden="true"> 🎬 </span>
                  </div>
                }

                <div
                  class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <h3 class="mb-1 text-lg font-bold leading-tight text-white">
                    {{ item.movie.title }}
                  </h3>

                  @if (item.movie.releaseYear) {
                    <p class="mb-3 text-sm text-neutral-300">
                      {{ item.movie.releaseYear }}
                    </p>
                  }

                  <button
                    type="button"
                    (click)="removeFromWatchlist(item.movie.id)"
                    class="min-h-[44px] rounded-lg bg-red-500/80 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                  >
                    Remover
                  </button>
                </div>

                <div class="p-3 md:hidden">
                  <h3 class="line-clamp-2 text-sm font-bold">
                    {{ item.movie.title }}
                  </h3>

                  <button
                    type="button"
                    (click)="removeFromWatchlist(item.movie.id)"
                    class="mt-3 min-h-[40px] w-full rounded-lg bg-red-500/80 py-2 text-xs font-semibold text-white"
                  >
                    Remover
                  </button>
                </div>
              </article>
            }
          </div>

          @if (!isLastPage()) {
            <div class="mt-12 flex justify-center">
              <button
                type="button"
                (click)="loadMore()"
                [disabled]="loadingMore()"
                class="min-h-[44px] rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                @if (loadingMore()) {
                  Carregando...
                } @else {
                  Carregar mais
                }
              </button>
            </div>
          }
        }
      </div>
    </main>

    <app-footer></app-footer>

    @if (showModal()) {
      <div
        class="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 backdrop-blur-md md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Buscar filmes"
        (click)="closeModal()"
      >
        <div
          class="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#0f0f1a]"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center gap-4 border-b border-white/10 bg-white/5 p-6">
            <span class="text-xl text-neutral-400" aria-hidden="true"> 🔍 </span>

            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="min-h-[44px] flex-1 border-none bg-transparent text-xl text-white outline-none placeholder-neutral-500 focus:ring-0 md:text-2xl"
              placeholder="Digite o nome do filme..."
              aria-label="Buscar filme pelo nome"
              autofocus
            />

            <button
              type="button"
              (click)="closeModal()"
              class="min-h-[44px] p-2 text-neutral-400 hover:text-white"
              aria-label="Fechar busca"
            >
              ✕
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            @if (searchLoading()) {
              <div class="flex justify-center py-20">
                <div
                  class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#FFC250]"
                ></div>
              </div>
            } @else if (searchResults().length > 0) {
              <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                @for (result of searchResults(); track result.tmdbId) {
                  <article
                    class="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-white/20"
                  >
                    @if (result.posterUrl) {
                      <img
                        [src]="result.posterUrl"
                        [alt]="result.title"
                        class="aspect-[2/3] w-full object-cover"
                        loading="lazy"
                      />
                    } @else {
                      <div
                        class="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-br from-[#2B4393]/20 to-[#0f0f1a]"
                      >
                        <span class="text-4xl opacity-30">🎬</span>
                      </div>
                    }

                    <div class="flex flex-1 flex-col justify-between p-3">
                      <div class="mb-3">
                        <h3 class="line-clamp-2 text-sm font-bold leading-tight">
                          {{ result.title }}
                        </h3>

                        @if (result.releaseDate) {
                          <span class="text-xs text-neutral-400">
                            {{ result.releaseDate.substring(0, 4) }}
                          </span>
                        }
                      </div>

                      <button
                        type="button"
                        (click)="addToWatchlist(result.tmdbId)"
                        [disabled]="
                          watchlistTmdbIds().has(result.tmdbId) || addingTmdbId() === result.tmdbId
                        "
                        class="min-h-[44px] w-full rounded-lg border border-[#2B4393]/50 bg-[#2B4393]/20 py-1.5 text-sm text-[#7B9CFF] transition-colors hover:bg-[#2B4393] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        @if (watchlistTmdbIds().has(result.tmdbId)) {
                          Na lista
                        } @else if (addingTmdbId() === result.tmdbId) {
                          <span
                            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                            aria-label="Adicionando"
                          ></span>
                        } @else {
                          Adicionar
                        }
                      </button>
                    </div>
                  </article>
                }
              </div>
            } @else if (searchQuery().trim().length > 2) {
              <div class="py-20 text-center text-neutral-400">
                Nenhum filme encontrado para "{{ searchQuery() }}"
              </div>
            } @else {
              <div class="py-20 text-center text-neutral-500">
                🎬 Busque pelo título original ou em português.
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .line-clamp-2 {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  `,
})
export class WatchlistComponent implements OnInit, OnDestroy {
  private readonly watchlistService = inject(WatchlistService);
  private readonly movieService = inject(MovieService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly items = signal<WatchlistItemResponse[]>([]);
  readonly loading = signal(true);
  readonly loadingMore = signal(false);
  readonly page = signal(0);
  readonly totalPages = signal(0);

  readonly showModal = signal(false);
  readonly searchQuery = signal('');
  readonly searchResults = signal<MovieSearchResult[]>([]);
  readonly searchLoading = signal(false);
  readonly addingTmdbId = signal<number | null>(null);
  readonly watchlistTmdbIds = signal<Set<number>>(new Set());

  readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Lista de Desejos',
      description: 'Gerencie sua lista de filmes que deseja assistir no CineCrew.',
    });

    this.loadWatchlist();

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          this.searchQuery.set(query);
        }),
        tap((query) => {
          if (query.trim().length <= 2) {
            this.searchResults.set([]);
            this.searchLoading.set(false);
          }
        }),
        switchMap((query) => {
          const normalizedQuery = query.trim();

          if (normalizedQuery.length <= 2) {
            return of([] as MovieSearchResult[]);
          }

          this.searchLoading.set(true);

          return this.movieService.searchMovies(normalizedQuery, 1).pipe(
            catchError(() => {
              this.toastService.error('Erro ao buscar filmes. Tente novamente.');

              return of([] as MovieSearchResult[]);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.searchResults.set(results);
        this.searchLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openSearchModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.searchLoading.set(false);
    this.searchSubject.next('');
  }

  loadWatchlist(): void {
    if (this.page() === 0) {
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }

    this.watchlistService
      .getMyWatchlist(this.page(), 20)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page: WatchlistPage) => {
          if (this.page() === 0) {
            this.items.set(page.content);
          } else {
            this.items.update((current) => [...current, ...page.content]);
          }

          this.totalPages.set(page.totalPages);
          this.updateWatchlistTmdbIds();
          this.loading.set(false);
          this.loadingMore.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadingMore.set(false);
          this.toastService.error('Não foi possível carregar sua lista de desejos.');
        },
      });
  }

  loadMore(): void {
    if (this.loadingMore() || this.isLastPage()) {
      return;
    }

    this.page.update((current) => current + 1);
    this.loadWatchlist();
  }

  isLastPage(): boolean {
    return this.totalPages() === 0 || this.page() >= this.totalPages() - 1;
  }

  removeFromWatchlist(movieId: number): void {
    const confirmed = window.confirm('Deseja remover este filme da lista?');

    if (!confirmed) {
      return;
    }

    this.watchlistService
      .removeFromWatchlist(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.items.update((items) => items.filter((item) => item.movie.id !== movieId));

          this.updateWatchlistTmdbIds();

          this.toastService.success('Filme removido da lista.');
        },
        error: () => {
          this.toastService.error('Não foi possível remover o filme.');
        },
      });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchSubject.next(input.value);
  }

  addToWatchlist(tmdbId: number): void {
    if (this.watchlistTmdbIds().has(tmdbId) || this.addingTmdbId() === tmdbId) {
      return;
    }

    this.addingTmdbId.set(tmdbId);

    this.movieService
      .importMovie(tmdbId)
      .pipe(
        switchMap((movie) => this.watchlistService.addToWatchlist(movie.id)),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => {
          this.watchlistTmdbIds.update((ids) => {
            const updated = new Set(ids);
            updated.add(tmdbId);
            return updated;
          });

          this.addingTmdbId.set(null);
          this.closeModal();
          this.page.set(0);
          this.items.set([]);
          this.totalPages.set(0);
          this.loadWatchlist();

          this.toastService.success('Filme adicionado à lista.');
        },
        error: (error) => {
          this.addingTmdbId.set(null);

          if (error?.status === 409) {
            this.watchlistTmdbIds.update((ids) => {
              const updated = new Set(ids);
              updated.add(tmdbId);
              return updated;
            });

            this.toastService.error('Este filme já está na sua lista.');

            return;
          }

          this.toastService.error('Não foi possível adicionar o filme.');
        },
      });
  }

  private updateWatchlistTmdbIds(): void {
    const ids = new Set(
      this.items()
        .map((item) => item.movie.tmdbId)
        .filter((id): id is number => id != null),
    );

    this.watchlistTmdbIds.set(ids);
  }
}
