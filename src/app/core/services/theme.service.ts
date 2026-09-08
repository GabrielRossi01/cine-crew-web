import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>(this.getStoredTheme());
  readonly theme = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';

  constructor() {
    effect(() => {
      const theme = this._theme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('cc_theme', theme);
    });
  }

  toggleTheme(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private getStoredTheme(): Theme {
    return (localStorage.getItem('cc_theme') as Theme) || 'dark';
  }
}
