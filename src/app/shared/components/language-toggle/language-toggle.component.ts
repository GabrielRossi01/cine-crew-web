import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="toggle()" 
      class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all duration-300 text-neutral-100 text-sm font-medium"
      aria-label="Toggle language"
      title="Toggle language">
      {{ languageService.language() }}
    </button>
  `,
  styles: [``]
})
export class LanguageToggleComponent {
  languageService = inject(LanguageService);

  toggle() {
    this.languageService.toggleLanguage();
  }
}
