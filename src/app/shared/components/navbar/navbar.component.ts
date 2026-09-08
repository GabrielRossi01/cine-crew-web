import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent, LanguageToggleComponent, HamburgerMenuComponent],
  template: `
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#2B4393]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center gap-2 text-2xl font-bold text-neutral-100 hover:text-accent transition-colors">
              <span class="text-2xl">🎬</span>
              <span>CineCrew</span>
            </a>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-4">
            @if (authService.isAuthenticated()) {
              <a routerLink="/clubs" routerLinkActive="text-accent" class="text-neutral-100 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Meus Clubes</a>
              <a routerLink="/watchlist" routerLinkActive="text-accent" class="text-neutral-100 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Lista de Desejos</a>
              <a routerLink="/movies" routerLinkActive="text-accent" class="text-neutral-100 hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">Filmes</a>
            }
          </div>

          <!-- Right side -->
          <div class="hidden md:flex items-center space-x-4">
            <app-theme-toggle></app-theme-toggle>
            <app-language-toggle></app-language-toggle>
            
            @if (authService.isAuthenticated()) {
              <div class="relative group">
                <button class="flex items-center gap-2 focus:outline-none">
                  <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent">
                    <span class="text-sm font-bold text-accent">{{ getInitials() }}</span>
                  </div>
                </button>
                <div class="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl py-1 bg-[#1a1a2e] border border-white/10 hidden group-hover:block transition-all duration-300">
                  <a routerLink="/profile" class="block px-4 py-2 text-sm text-neutral-100 hover:bg-white/5">Perfil</a>
                  <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5">Sair</button>
                </div>
              </div>
            } @else {
              <a routerLink="/login" class="text-neutral-100 bg-accent/20 hover:bg-accent/40 border border-accent/50 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300">Entrar</a>
            }
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden gap-2">
            <app-theme-toggle></app-theme-toggle>
            <app-hamburger-menu [isOpen]="isMobileMenuOpen()" (toggle)="toggleMobileMenu()"></app-hamburger-menu>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-white/10">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            @if (authService.isAuthenticated()) {
              <a routerLink="/clubs" class="text-neutral-100 hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Meus Clubes</a>
              <a routerLink="/watchlist" class="text-neutral-100 hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Lista de Desejos</a>
              <a routerLink="/movies" class="text-neutral-100 hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Filmes</a>
              <button (click)="logout()" class="text-red-400 hover:bg-white/5 w-full text-left block px-3 py-2 rounded-md text-base font-medium">Sair</button>
            } @else {
              <a routerLink="/login" class="text-neutral-100 hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Entrar</a>
            }
            <div class="px-3 py-2">
              <app-language-toggle></app-language-toggle>
            </div>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [``]
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  router = inject(Router);

  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  }
}
