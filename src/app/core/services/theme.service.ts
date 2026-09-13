import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'cinecrew-theme';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  toggle(): void {
    this.toggleTheme();
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  isLight(): boolean {
    return this.theme() === 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const isLight = theme === 'light';

    document.documentElement.classList.toggle('light', isLight);
    document.body?.classList.toggle('light', isLight);
    document.documentElement.style.colorScheme = theme;
  }

  private persistTheme(theme: Theme): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private resolveInitialTheme(): Theme {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;

    return prefersLight ? 'light' : 'dark';
  }
}
