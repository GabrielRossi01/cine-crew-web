import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/15 h-full flex flex-col cursor-pointer">
      <div class="relative w-full aspect-[2/3] bg-[#0f0f1a] flex items-center justify-center overflow-hidden">
        @if (posterUrl) {
          <img [src]="posterUrl" [alt]="title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
        } @else {
          <div class="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex flex-col items-center justify-center text-neutral-500">
            <span class="text-4xl mb-2">🎬</span>
            <span class="text-sm px-4 text-center break-words">{{ title }}</span>
          </div>
        }
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          @if (showAdd && !inWatchlist) {
            <button (click)="$event.stopPropagation(); addClick.emit()" class="w-8 h-8 rounded-full bg-[#2B4393]/80 backdrop-blur text-white flex items-center justify-center hover:bg-accent transition-colors shadow-lg" aria-label="Add to watchlist" title="Add to watchlist">
              +
            </button>
          }
          @if (showRemove) {
            <button (click)="$event.stopPropagation(); removeClick.emit()" class="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg" aria-label="Remove" title="Remove">
              &times;
            </button>
          }
        </div>
      </div>
      
      <div class="p-4 flex-1 flex flex-col">
        <h3 class="text-neutral-100 font-bold text-sm sm:text-base line-clamp-2" [title]="title">{{ title }}</h3>
        @if (year) {
          <span class="text-neutral-400 text-xs sm:text-sm mt-1">{{ year }}</span>
        }
      </div>
    </div>
  `,
  styles: [``]
})
export class MovieCardComponent {
  @Input({ required: true }) title!: string;
  @Input() posterUrl: string | null = null;
  @Input() year: string | number | null = null;
  @Input() tmdbId?: number;
  @Input() movieId?: number;
  
  @Input() showAdd = false;
  @Input() showRemove = false;
  @Input() inWatchlist = false;

  @Output() addClick = new EventEmitter<void>();
  @Output() removeClick = new EventEmitter<void>();
}
