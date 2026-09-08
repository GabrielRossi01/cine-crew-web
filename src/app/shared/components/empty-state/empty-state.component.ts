import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
      <div class="text-6xl mb-4 opacity-80">{{ icon }}</div>
      <h3 class="text-xl font-bold text-neutral-100 mb-2">{{ title }}</h3>
      <p class="text-neutral-400 max-w-md mb-6">{{ description }}</p>
      
      @if (actionLabel) {
        <app-button (click)="actionClick.emit()" variant="primary">
          {{ actionLabel }}
        </app-button>
      }
    </div>
  `,
  styles: [``]
})
export class EmptyStateComponent {
  @Input() icon = '🎬';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() actionLabel?: string;
  
  @Output() actionClick = new EventEmitter<void>();
}
