import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { MovieService } from '../../../core/services/movie.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { MovieSearchResult } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main
      class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-neutral-100 pt-24 pb-12 px-4 md:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold font-sora mb-8 text-center text-white">
          Buscar Filmes
        </h1>

        <div class="max-w-3xl mx-auto mb-12 relative">
          <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg
              class="h-6 w-6 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            (input)="onSearchInput($event)"
            aria-label="Buscar filmes por título"
            class="w-full bg-white/5 border border-white/20 rounded-full pl-16 pr-6 py-4 text-xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFC250] focus:bg-white/10 transition-all shadow-xl min-h-[44px]"
            placeholder="Digite o título do filme..."
            autofocus
          />
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i) {
              <div
                class="bg-white/5 animate-pulse rounded-2xl aspect-[2/3] border border-white/10"
              ></div>
            }
          </div>
        } @else if (hasSearched() && results().length === 0) {
          <div
            class="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-2xl mx-auto shadow-2xl"
          >
            <span class="text-5xl mb-4 block" aria-hidden="true">🔍</span>
            <h2 class="text-2xl font-bold mb-2">Nenhum filme encontrado</h2>
            <p class="text-neutral-400">
              Tente buscar por termos diferentes ou confira a ortografia.
            </p>
          </div>
        } @else if (!hasSearched()) {
          <div class="text-center py-20 max-w-2xl mx-auto">
            <span class="text-6xl mb-6 block opacity-50" aria-hidden="true">🎥</span>
            <h2 class="text-2xl font-bold text-neutral-400">Busque por um filme para começar</h2>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            @for (movie of results(); track movie.tmdbId) {
              <div
                class="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#FFC250]/50 transition-all flex flex-col h-full shadow-lg"
              >
                <div
                  class="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-[#2B4393]/40 to-[#1a1a2e] flex items-center justify-center"
                >
                  @if (movie.posterUrl) {
                    <img
                      [src]="movie.posterUrl"
                      [alt]="movie.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  } @else {
                    <div class="flex flex-col items-center justify-center p-4 text-center">
                      <span class="text-5xl mb-2 select-none" aria-hidden="true">🎬</span>
                      <span class="text-xs text-neutral-400 font-medium line-clamp-2">{{
                        movie.title
                      }}</span>
                    </div>
                  }
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  ></div>
                </div>

                <div class="p-4 flex-1 flex flex-col justify-between bg-[#1a1a2e]/95 z-10">
                  <div class="mb-4">
                    <h3 class="font-bold text-white leading-tight mb-1 line-clamp-2 font-sora">
                      {{ movie.title }}
                    </h3>
                    @if (movie.releaseDate) {
                      <p class="text-neutral-400 text-sm">{{ movie.releaseDate | date: 'yyyy' }}</p>
                    }
                  </div>

                  <button
                    (click)="addToWatchlist(movie.tmdbId)"
                    [disabled]="watchlistSet().has(movie.tmdbId) || addingTmdbId() === movie.tmdbId"
                    [attr.aria-label]="
                      watchlistSet().has(movie.tmdbId)
                        ? 'Filme já está na lista'
                        : 'Adicionar ' + movie.title + ' à lista'
                    "
                    class="w-full py-2.5 rounded-xl text-sm font-bold transition-all min-h-[44px] flex items-center justify-center gap-2"
                    [ngClass]="
                      watchlistSet().has(movie.tmdbId)
                        ? 'bg-white/10 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#2B4393]/20 text-[#FFC250] border border-[#FFC250]/50 hover:bg-[#FFC250] hover:text-[#0f0f1a]'
                    "
                  >
                    @if (addingTmdbId() === movie.tmdbId) {
                      <span
                        class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
                        role="status"
                        aria-label="Adicionando..."
                      ></span>
                      <span>Adicionando...</span>
                    } @else if (watchlistSet().has(movie.tmdbId)) {
                      <span>✓ Na Lista</span>
                    } @else {
                      <span>+ Adicionar à Lista</span>
                    }
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </main>

    <app-footer></app-footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MovieSearchComponent implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();

  readonly results = signal<MovieSearchResult[]>([]);
  readonly loading = signal(false);
  readonly hasSearched = signal(false);
  readonly watchlistSet = signal<Set<number>>(new Set());
  readonly addingTmdbId = signal<number | null>(null);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Buscar Filmes',
      description: 'Pesquise filmes e adicione à sua lista de desejos no CineCrew',
    });

    this.loadWatchlist();

    this.searchSubject
      .pipe(
        debounceTime(300),
        map((query) => query.trim()),
        distinctUntilChanged(),
        tap((query) => {
          if (query.length <= 2) {
            this.results.set([]);
            this.hasSearched.set(false);
            this.loading.set(false);
          }
        }),
        filter((query) => query.length > 2),
        tap(() => {
          this.loading.set(true);
          this.hasSearched.set(true);
        }),
        switchMap((query) =>
          this.movieService.searchMovies(query, 1).pipe(
            catchError(() => {
              this.toastService.error('Erro ao buscar filmes. Tente novamente.');

              return of([] as MovieSearchResult[]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((results) => {
        this.results.set(results);
        this.loading.set(false);
      });
  }

  private loadWatchlist(): void {
    this.watchlistService
      .getMyWatchlist(0, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          const tmdbIds = new Set(
            page.content
              .map((item) => item.movie.tmdbId)
              .filter((tmdbId): tmdbId is number => tmdbId != null),
          );

          this.watchlistSet.set(tmdbIds);
        },
        error: () => {
          this.watchlistSet.set(new Set());
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
  }

  addToWatchlist(tmdbId: number): void {
    if (this.watchlistSet().has(tmdbId) || this.addingTmdbId() === tmdbId) {
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
          this.watchlistSet.update((set) => {
            const updated = new Set(set);
            updated.add(tmdbId);
            return updated;
          });

          this.addingTmdbId.set(null);
          this.toastService.success('Filme adicionado à sua lista!');
        },
        error: (error) => {
          this.addingTmdbId.set(null);

          if (error.status === 409) {
            this.watchlistSet.update((set) => {
              const updated = new Set(set);
              updated.add(tmdbId);
              return updated;
            });

            this.toastService.error('Este filme já está na sua lista.');

            return;
          }

          this.toastService.error('Erro ao adicionar filme à lista.');
        },
      });
  }
}
