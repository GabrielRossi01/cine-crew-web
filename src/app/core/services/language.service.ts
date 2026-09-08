import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Language = 'pt' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly _language = signal<Language>(this.getStoredLanguage());
  private readonly _translations = signal<Record<string, string>>({});

  readonly language = this._language.asReadonly();
  readonly translations = this._translations.asReadonly();

  constructor() {
    this.loadTranslations(this._language());
  }

  setLanguage(lang: Language): void {
    this._language.set(lang);
    localStorage.setItem('cc_lang', lang);
    this.loadTranslations(lang);
  }

  toggleLanguage(): void {
    const next = this._language() === 'pt' ? 'en' : 'pt';
    this.setLanguage(next);
  }

  t(key: string): string {
    return this._translations()[key] || key;
  }

  private loadTranslations(lang: Language): void {
    this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`).subscribe({
      next: (translations) => this._translations.set(translations),
      error: () => console.warn(`Failed to load translations for ${lang}`),
    });
  }

  private getStoredLanguage(): Language {
    return (localStorage.getItem('cc_lang') as Language) || 'pt';
  }
}
