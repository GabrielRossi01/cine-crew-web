import { Component, HostListener, inject, signal } from '@angular/core';
import { Language, LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  template: `
    <div class="relative">
      <button
        type="button"
        class="group flex h-10 min-w-[78px] items-center justify-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-[#a9bcff]/70 hover:bg-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a9bcff] dark:text-white light:border-slate-900/10 light:bg-white/60 light:text-slate-800"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="menu"
        aria-label="Selecionar idioma"
        (click)="toggleMenu($event)"
      >
        <svg
          class="h-4 w-4 text-white/90 dark:text-white/90 light:text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3a14.7 14.7 0 0 1 0 18M12 3a14.7 14.7 0 0 0 0 18"></path>
        </svg>

        <span>{{ languageService.language().toUpperCase() }}</span>

        <svg
          class="h-3.5 w-3.5 transition-transform duration-300"
          [class.rotate-180]="isOpen()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>

      @if (isOpen()) {
        <div
          role="menu"
          class="absolute right-0 top-[calc(100%+0.65rem)] w-52 overflow-hidden rounded-2xl border border-white/[0.14] bg-[#15161b]/85 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-2xl dark:bg-[#15161b]/85 light:border-slate-900/10 light:bg-white/90"
        >
          @for (option of languages; track option.code) {
            <button
              type="button"
              role="menuitemradio"
              [attr.aria-checked]="languageService.language() === option.code"
              (click)="selectLanguage(option.code)"
              class="flex min-h-[46px] w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-all duration-200"
              [class.bg-white/10]="languageService.language() === option.code"
              [class.text-white]="languageService.language() === option.code"
              [class.text-neutral-300]="languageService.language() !== option.code"
              [class.hover:bg-white/5]="languageService.language() !== option.code"
              [class.light:bg-slate-900/8]="languageService.language() === option.code"
              [class.light:text-slate-950]="languageService.language() === option.code"
              [class.light:text-slate-600]="languageService.language() !== option.code"
              [class.light:hover:bg-slate-900/5]="languageService.language() !== option.code"
            >
              <span
                class="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.08] text-[10px] font-bold tracking-wide text-neutral-300 light:bg-slate-900/[0.06] light:text-slate-600"
              >
                {{ option.code.toUpperCase() }}
              </span>

              <span class="flex-1">{{ option.label }}</span>

              @if (languageService.language() === option.code) {
                <svg
                  class="h-4 w-4 text-[#8fa8ff]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  aria-label="Idioma selecionado"
                >
                  <path d="m5 12 4 4L19 6"></path>
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class LanguageToggleComponent {
  readonly languageService = inject(LanguageService);
  readonly isOpen = signal(false);

  readonly languages: ReadonlyArray<{ code: Language; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
  ];

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((open) => !open);
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.isOpen.set(false);
  }

  @HostListener('document:click')
  closeOnOutsideClick(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.isOpen.set(false);
  }
}
