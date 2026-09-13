import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-[#FFC250] shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#FFC250]/50 hover:bg-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] dark:text-[#FFC250] light:border-slate-900/10 light:bg-white/60 light:text-[#2B4393]"
      [attr.aria-label]="themeService.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'"
      [attr.title]="themeService.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'"
      (click)="themeService.toggleTheme()"
    >
      @if (themeService.isDark()) {
        <svg
          class="h-5 w-5 transition-transform duration-500 group-hover:rotate-45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3.5"></circle>
          <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"></path>
        </svg>
      } @else {
        <svg
          class="h-5 w-5 transition-transform duration-500 group-hover:-rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path d="M20.6 15.4A8.8 8.8 0 0 1 8.6 3.4 8.8 8.8 0 1 0 20.6 15.4Z"></path>
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
}
