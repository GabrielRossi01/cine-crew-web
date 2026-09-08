import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieService } from '../../core/services/movie.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { WatchlistItemResponse } from '../../core/models/watchlist.model';
import { MovieSearchResult } from '../../core/models/movie.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] text-neutral-100 pt-24 pb-12 px-4 md:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 class="text-3xl md:text-4xl font-bold font-sora">Lista de Desejos</h1>
          <button (click)="showModal.set(true)"
                  class="bg-[#FFC250] text-[#0f0f1a] px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-[#FFC250]/30 min-h-[44px]">
            + Adicionar Filme
          </button>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            @for (i of skeletons; track i) {
              <div class="bg-white/5 animate-pulse rounded-2xl aspect-[2/3] border border-white/10"></div>
            }
          </div>
        } @else if (items().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
            <span class="text-6xl mb-4">🍿</span>
            <h2 class="text-2xl font-bold mb-2">Sua lista está vazia</h2>
            <p class="text-neutral-400 mb-6 text-center max-w-md">Adicione filmes que você deseja assistir com seus amigos e clubes.</p>
            <button (click)="showModal.set(true)" class="bg-[#FFC250] text-[#0f0f1a] px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all min-h-[44px]">
              Explorar Filmes
            </button>
          </div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            @for (item of items(); track item.id) {
              <div class="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]">
                @if (item.movie.posterUrl) {
                  <img [src]="item.movie.posterUrl" [alt]="item.movie.title" class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500">
                } @else {
                  <div class="w-full aspect-[2/3] bg-gradient-to-br from-[#2B4393]/30 to-[#0f0f1a] flex items-center justify-center">
                    <span class="text-5xl opacity-30">🎬</span>
                  </div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 class="font-bold text-white text-lg leading-tight mb-1">{{ item.movie.title }}</h3>
                  <p class="text-neutral-300 text-sm mb-3">{{ item.movie.releaseYear }}</p>
                  <button (click)="removeFromWatchlist(item.movie.id)" class="bg-red-500/80 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px]">
                    Remover
                  </button>
                </div>
              </div>
            }
          </div>

          @if (!isLastPage()) {
            <div class="mt-12 flex justify-center">
              <button (click)="loadMore()" class="border border-white/20 hover:bg-white/5 text-white px-8 py-3 rounded-full font-semibold transition-all min-h-[44px]">
                Carregar mais
              </button>
            </div>
          }
        }
      </div>
    </main>

    <app-footer></app-footer>

    <!-- Search Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/90 z-50 flex flex-col p-4 md:p-8 backdrop-blur-md">
        <div class="w-full max-w-5xl mx-auto flex flex-col h-full bg-[#0f0f1a] border border-white/20 rounded-3xl overflow-hidden">

          <div class="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" [value]="searchQuery()" (input)="onSearchInput($event)"
                   class="flex-1 bg-transparent border-none text-xl md:text-2xl text-white focus:outline-none focus:ring-0 placeholder-neutral-500 min-h-[44px]"
                   placeholder="Digite o nome do filme..." autofocus>
            <button (click)="closeModal()" class="text-neutral-400 hover:text-white p-2 min-h-[44px]" aria-label="Fechar busca">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            @if (searchLoading()) {
              <div class="flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC250]"></div>
              </div>
            } @else if (searchResults().length > 0) {
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                @for (result of searchResults(); track result.tmdbId) {
                  <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-white/20 transition-colors">
                    @if (result.posterUrl) {
                      <img [src]="result.posterUrl" [alt]="result.title" class="w-full aspect-[2/3] object-cover">
                    } @else {
                      <div class="w-full aspect-[2/3] bg-gradient-to-br from-[#2B4393]/20 to-[#0f0f1a] flex items-center justify-center">
                        <span class="text-4xl opacity-30">🎬</span>
                      </div>
                    }
                    <div class="p-3 flex-1 flex flex-col justify-between">
                      <div class="mb-3">
                        <h4 class="font-bold text-sm leading-tight line-clamp-2">{{ result.title }}</h4>
                        <span class="text-xs text-neutral-400">{{ result.releaseDate?.substring(0, 4) }}</span>
                      </div>
                      <button (click)="addToWatchlist(result.tmdbId)"
                              [disabled]="addingTmdbId() === result.tmdbId"
                              class="w-full bg-[#2B4393]/20 text-[#7B9CFF] border border-[#2B4393]/50 hover:bg-[#2B4393] hover:text-white py-1.5 rounded-lg text-sm transition-colors min-h-[44px] disabled:opacity-50">
                        @if (addingTmdbId() === result.tmdbId) {
                          <span class="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                        } @else {
                          Adicionar
                        }
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else if (searchQuery().length > 2) {
              <div class="text-center py-20 text-neutral-400">
                Nenhum filme encontrado para "{{ searchQuery() }}"
              </div>
            } @else {
              <div class="text-center py-20 text-neutral-500">
                🎬 Busque pelo título original ou em português.
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class WatchlistComponent implements OnInit, OnDestroy {
  private readonly watchlistService = inject(WatchlistService);
  private readonly movieService = inject(MovieService);
  private readonly seoService = inject(SeoService);
  private readonly toastService = inject(ToastService);

  items = signal<WatchlistItemResponse[]>([]);
  loading = signal(true);
  page = signal(0);
  totalPages = signal(0);

  showModal = signal(false);
  searchQuery = signal('');
  searchResults = signal<MovieSearchResult[]>([]);
  searchLoading = signal(false);
  addingTmdbId = signal<number | null>(null);

  skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Lista de Desejos',
      description: 'Gerencie sua lista de filmes que deseja assistir no CineCrew.'
    });
    this.loadWatchlist();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery.set(query);
      if (query.length > 2) {
        this.performSearch(query);
      } else {
        this.searchResults.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWatchlist(): void {
    this.loading.set(true);
    this.watchlistService.getMyWatchlist(this.page(), 20).subscribe({
      next: (page) => {
        if (this.page() === 0) {
          this.items.set(page.content);
        } else {
          this.items.update(curr => [...curr, ...page.content]);
        }
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore(): void {
    this.page.update(p => p + 1);
    this.loadWatchlist();
  }

  isLastPage(): boolean {
    return this.page() >= this.totalPages() - 1;
  }

  removeFromWatchlist(movieId: number): void {
    if (confirm('Deseja remover este filme da lista?')) {
      this.watchlistService.removeFromWatchlist(movieId).subscribe({
        next: () => {
          this.items.update(items => items.filter(i => i.movie.id !== movieId));
          this.toastService.success('Filme removido da lista');
        }
      });
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  performSearch(query: string): void {
    this.searchLoading.set(true);
    this.movieService.searchMovies(query, 1).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.searchLoading.set(false);
      },
      error: () => this.searchLoading.set(false)
    });
  }

  addToWatchlist(tmdbId: number): void {
    this.addingTmdbId.set(tmdbId);
    this.movieService.importMovie(tmdbId).pipe(
      switchMap(imported => this.watchlistService.addToWatchlist(imported.id))
    ).subscribe({
      next: () => {
        this.toastService.success('Filme adicionado à lista!');
        this.addingTmdbId.set(null);
        this.closeModal();
        this.page.set(0);
        this.loadWatchlist();
      },
      error: () => {
        this.addingTmdbId.set(null);
      }
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
}
