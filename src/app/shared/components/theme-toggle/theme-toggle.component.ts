import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggle()" 
      class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 text-neutral-100"
      aria-label="Toggle theme"
      title="Toggle theme">
      @if (themeService.isDark()) {
        <span class="text-xl">🌙</span>
      } @else {
        <span class="text-xl">☀️</span>
      }
    </button>
  `,
  styles: [``]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  toggle() {
    this.themeService.toggleTheme();
  }
}
