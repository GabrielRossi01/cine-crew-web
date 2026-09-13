import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

import {
  ChevronDown,
  Globe2,
  LogIn,
  LogOut,
  LucideAngularModule,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header
      class="fixed inset-x-0 top-0 z-50 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-bg-header)] text-[var(--cc-text-primary)] backdrop-blur-xl"
    >
      <nav
        class="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-12"
        aria-label="Navegação principal"
      >
        <a
          routerLink="/"
          fragment="inicio"
          class="group inline-flex w-[142px] shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)]"
          aria-label="CineCrew - Página inicial"
          (click)="scrollToHome($event)"
        >
          <img
            src="cine-crew-logo.svg"
            alt="CineCrew"
            class="h-8 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </a>

        <div
          class="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex"
        >
          <div class="pointer-events-auto flex items-center gap-1">
            <a
              routerLink="/"
              fragment="inicio"
              class="nav-link"
              (click)="scrollToSection($event, 'inicio')"
            >
              Início
            </a>

            <a routerLink="/clubes" class="nav-link">
              Clubes
            </a>

            <a routerLink="/recursos" class="nav-link">
              Recursos
            </a>
          </div>
        </div>

        <div class="hidden shrink-0 items-center gap-1.5 lg:flex">
          <div class="relative">
            <button
              type="button"
              class="utility-button inline-flex items-center gap-1"
              [attr.aria-expanded]="isLanguageMenuOpen()"
              aria-label="Selecionar idioma"
              (click)="toggleLanguageMenu()"
            >
              <lucide-icon
                [img]="Globe2"
                [size]="15"
                strokeWidth="1.8"
              ></lucide-icon>

              <span>{{ selectedLanguage() }}</span>

              <lucide-icon
                [img]="ChevronDown"
                [size]="12"
                strokeWidth="1.8"
                class="transition-transform duration-200"
                [class.rotate-180]="isLanguageMenuOpen()"
              ></lucide-icon>
            </button>

            @if (isLanguageMenuOpen()) {
              <div class="language-menu">
                <button
                  type="button"
                  class="language-option"
                  [class.language-option-active]="selectedLanguage() === 'PT'"
                  (click)="selectLanguage('PT')"
                >
                  Português
                </button>

                <button
                  type="button"
                  class="language-option"
                  [class.language-option-active]="selectedLanguage() === 'EN'"
                  (click)="selectLanguage('EN')"
                >
                  English
                </button>
              </div>
            }
          </div>

          <button
            type="button"
            class="theme-toggle"
            [attr.aria-label]="
              isDarkMode() ? 'Ativar tema claro' : 'Ativar tema escuro'
            "
            [attr.aria-pressed]="isDarkMode()"
            (click)="toggleTheme()"
          >
            @if (isDarkMode()) {
              <lucide-icon
                [img]="Sun"
                [size]="15"
                strokeWidth="1.8"
              ></lucide-icon>
            } @else {
              <lucide-icon
                [img]="Moon"
                [size]="15"
                strokeWidth="1.8"
              ></lucide-icon>
            }
          </button>

          <span
            class="mx-1 h-5 w-px bg-[var(--cc-border-subtle)]"
            aria-hidden="true"
          ></span>

          @if (authService.isAuthenticated()) {
            <div class="relative">
              <button
                type="button"
                class="user-menu-trigger"
                [attr.aria-expanded]="isUserMenuOpen()"
                aria-label="Abrir menu do usuário"
                (click)="toggleUserMenu()"
              >
                <span class="user-avatar">
                  @if (authService.currentUser()?.avatarUrl) {
                    <img
                      [src]="authService.currentUser()?.avatarUrl!"
                      [alt]="authService.currentUser()?.name ?? 'Usuário'"
                    />
                  } @else {
                    {{ userInitials() }}
                  }
                </span>

                <span class="user-name">
                  {{ authService.currentUser()?.name ?? 'Minha conta' }}
                </span>

                <lucide-icon
                  [img]="ChevronDown"
                  [size]="13"
                  strokeWidth="1.8"
                  class="transition-transform duration-200"
                  [class.rotate-180]="isUserMenuOpen()"
                ></lucide-icon>
              </button>

              @if (isUserMenuOpen()) {
                <div class="user-menu-dropdown">
                  <div class="user-menu-header">
                    <span class="user-avatar user-avatar-large">
                      @if (authService.currentUser()?.avatarUrl) {
                        <img
                          [src]="authService.currentUser()?.avatarUrl!"
                          [alt]="authService.currentUser()?.name ?? 'Usuário'"
                        />
                      } @else {
                        {{ userInitials() }}
                      }
                    </span>

                    <div class="min-w-0">
                      <p
                        class="truncate text-sm font-semibold text-[var(--cc-text-primary)]"
                      >
                        {{ authService.currentUser()?.name ?? 'Usuário' }}
                      </p>

                      <p
                        class="mt-0.5 text-[11px] text-[var(--cc-text-muted)]"
                      >
                        Conta CineCrew
                      </p>
                    </div>
                  </div>

                  <div class="user-menu-divider"></div>

                  <a
                    routerLink="/perfil"
                    class="user-menu-link"
                    (click)="closeMenus()"
                  >
                    <lucide-icon
                      [img]="UserRound"
                      [size]="16"
                      strokeWidth="1.8"
                    ></lucide-icon>

                    Meu perfil
                  </a>

                  <a
                    routerLink="/clubs"
                    class="user-menu-link"
                    (click)="closeMenus()"
                  >
                    <lucide-icon
                      [img]="Settings"
                      [size]="16"
                      strokeWidth="1.8"
                    ></lucide-icon>

                    Meus clubes
                  </a>

                  <div class="user-menu-divider"></div>

                  <button
                    type="button"
                    class="user-menu-link user-menu-logout"
                    (click)="logout()"
                  >
                    <lucide-icon
                      [img]="LogOut"
                      [size]="16"
                      strokeWidth="1.8"
                    ></lucide-icon>

                    Sair
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="login-link">
              <lucide-icon
                [img]="LogIn"
                [size]="15"
                strokeWidth="1.8"
              ></lucide-icon>

              <span>Entrar</span>
            </a>

            <a routerLink="/register" class="create-club-button">
              Criar clube
            </a>
          }
        </div>

        <div class="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            class="theme-toggle"
            [attr.aria-label]="
              isDarkMode() ? 'Ativar tema claro' : 'Ativar tema escuro'
            "
            [attr.aria-pressed]="isDarkMode()"
            (click)="toggleTheme()"
          >
            @if (isDarkMode()) {
              <lucide-icon
                [img]="Sun"
                [size]="16"
                strokeWidth="1.8"
              ></lucide-icon>
            } @else {
              <lucide-icon
                [img]="Moon"
                [size]="16"
                strokeWidth="1.8"
              ></lucide-icon>
            }
          </button>

          <button
            type="button"
            class="mobile-menu-button"
            [attr.aria-label]="
              isMobileMenuOpen() ? 'Fechar menu' : 'Abrir menu'
            "
            [attr.aria-expanded]="isMobileMenuOpen()"
            (click)="toggleMobileMenu()"
          >
            @if (isMobileMenuOpen()) {
              <lucide-icon
                [img]="X"
                [size]="19"
                strokeWidth="1.8"
              ></lucide-icon>
            } @else {
              <lucide-icon
                [img]="Menu"
                [size]="19"
                strokeWidth="1.8"
              ></lucide-icon>
            }
          </button>
        </div>
      </nav>

      @if (isMobileMenuOpen()) {
        <div class="mobile-menu lg:hidden">
          <div class="mx-auto max-w-7xl px-5 pb-5 pt-2 sm:px-8">
            <div class="flex flex-col gap-1">
              <a
                routerLink="/"
                fragment="inicio"
                class="mobile-link"
                (click)="scrollToSection($event, 'inicio')"
              >
                Início
              </a>

              <a
                routerLink="/clubes"
                class="mobile-link"
                (click)="closeMenus()"
              >
                Clubes
              </a>

              <a
                routerLink="/recursos"
                class="mobile-link"
                (click)="closeMenus()"
              >
                Recursos
              </a>

              <a
                routerLink="/"
                fragment="faq"
                class="mobile-link"
                (click)="scrollToSection($event, 'faq')"
              >
                Perguntas Frequentes
              </a>
            </div>

            <div class="mt-4 border-t border-[var(--cc-border-subtle)] pt-4">
              @if (authService.isAuthenticated()) {
                <div class="mobile-user-summary">
                  <span class="user-avatar">
                    @if (authService.currentUser()?.avatarUrl) {
                      <img
                        [src]="authService.currentUser()?.avatarUrl!"
                        [alt]="authService.currentUser()?.name ?? 'Usuário'"
                      />
                    } @else {
                      {{ userInitials() }}
                    }
                  </span>

                  <div class="min-w-0">
                    <p
                      class="truncate text-sm font-semibold text-[var(--cc-text-primary)]"
                    >
                      {{ authService.currentUser()?.name ?? 'Minha conta' }}
                    </p>

                    <p class="text-[11px] text-[var(--cc-text-muted)]">
                      Você está conectado
                    </p>
                  </div>
                </div>

                <a
                  routerLink="/perfil"
                  class="mobile-link mobile-link-with-icon"
                  (click)="closeMenus()"
                >
                  <lucide-icon
                    [img]="UserRound"
                    [size]="16"
                    strokeWidth="1.8"
                  ></lucide-icon>

                  Meu perfil
                </a>

                <a
                  routerLink="/clubs"
                  class="mobile-link mobile-link-with-icon"
                  (click)="closeMenus()"
                >
                  <lucide-icon
                    [img]="Settings"
                    [size]="16"
                    strokeWidth="1.8"
                  ></lucide-icon>

                  Meus clubes
                </a>

                <button
                  type="button"
                  class="mobile-link mobile-link-with-icon mobile-logout"
                  (click)="logout()"
                >
                  <lucide-icon
                    [img]="LogOut"
                    [size]="16"
                    strokeWidth="1.8"
                  ></lucide-icon>

                  Sair
                </button>
              } @else {
                <div class="flex items-center justify-between">
                  <button
                    type="button"
                    class="mobile-language-button"
                    (click)="toggleLanguageMenu()"
                  >
                    <lucide-icon
                      [img]="Globe2"
                      [size]="16"
                      strokeWidth="1.8"
                    ></lucide-icon>

                    <span>{{ selectedLanguage() }}</span>

                    <lucide-icon
                      [img]="ChevronDown"
                      [size]="14"
                      strokeWidth="1.8"
                      [class.rotate-180]="isLanguageMenuOpen()"
                    ></lucide-icon>
                  </button>

                  <a
                    routerLink="/login"
                    class="mobile-login-link"
                    (click)="closeMenus()"
                  >
                    <lucide-icon
                      [img]="LogIn"
                      [size]="16"
                      strokeWidth="1.8"
                    ></lucide-icon>

                    Entrar
                  </a>
                </div>

                @if (isLanguageMenuOpen()) {
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      class="mobile-language-option"
                      [class.mobile-language-option-active]="
                        selectedLanguage() === 'PT'
                      "
                      (click)="selectLanguage('PT')"
                    >
                      Português
                    </button>

                    <button
                      type="button"
                      class="mobile-language-option"
                      [class.mobile-language-option-active]="
                        selectedLanguage() === 'EN'
                      "
                      (click)="selectLanguage('EN')"
                    >
                      English
                    </button>
                  </div>
                }
              }

              @if (!authService.isAuthenticated()) {
                <a
                  routerLink="/register"
                  class="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#FFC250] text-sm font-bold text-[#111827] transition-colors hover:bg-[#ffd477]"
                  (click)="closeMenus()"
                >
                  Criar clube
                </a>
              }
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .nav-link {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      padding: 0 0.58rem;
      border-radius: 0.4rem;
      color: var(--cc-text-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      transition:
        color 200ms ease,
        background-color 200ms ease;
    }

    .nav-link:hover {
      color: var(--cc-text-primary);
      background-color: rgba(128, 128, 128, 0.12);
    }

    .login-link,
    .user-menu-trigger {
      color: var(--cc-text-secondary);
      font-size: 0.8125rem;
      font-weight: 600;
      white-space: nowrap;
      transition:
        color 200ms ease,
        background-color 200ms ease;
    }

    .login-link {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      gap: 0.4rem;
      padding: 0 0.58rem;
      border-radius: 0.4rem;
    }

    .login-link:hover,
    .user-menu-trigger:hover {
      color: var(--cc-text-primary);
      background-color: rgba(128, 128, 128, 0.12);
    }

    .user-menu-trigger {
      display: inline-flex;
      min-height: 36px;
      align-items: center;
      gap: 0.45rem;
      padding: 0.2rem 0.45rem;
      border-radius: 0.55rem;
    }

    .user-name {
      display: block;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-avatar {
      display: inline-flex;
      width: 1.9rem;
      height: 1.9rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid var(--cc-border-strong);
      border-radius: 9999px;
      color: #111827;
      background: #ffc250;
      font-size: 0.7rem;
      font-weight: 800;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-avatar-large {
      width: 2.35rem;
      height: 2.35rem;
    }

    .create-club-button {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      justify-content: center;
      padding: 0 0.8rem;
      border-radius: 0.5rem;
      background: #ffc250;
      color: #111827;
      font-size: 0.8125rem;
      font-weight: 700;
      white-space: nowrap;
      transition:
        background-color 200ms ease,
        box-shadow 200ms ease,
        transform 200ms ease;
    }

    .create-club-button:hover {
      background: #ffd477;
      box-shadow: 0 0 22px rgba(255, 194, 80, 0.2);
      transform: translateY(-1px);
    }

    .user-menu-dropdown {
      position: absolute;
      top: calc(100% + 0.65rem);
      right: 0;
      min-width: 220px;
      padding: 0.45rem;
      border: 1px solid var(--cc-border-default);
      border-radius: 0.85rem;
      background: var(--cc-bg-card);
      box-shadow: var(--cc-shadow-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .user-menu-header {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.55rem 0.6rem;
    }

    .user-menu-divider {
      height: 1px;
      margin: 0.35rem 0;
      background: var(--cc-border-subtle);
    }

    .user-menu-link {
      display: flex;
      width: 100%;
      min-height: 36px;
      align-items: center;
      gap: 0.65rem;
      border-radius: 0.55rem;
      padding: 0 0.65rem;
      color: var(--cc-text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      text-align: left;
      transition:
        color 180ms ease,
        background-color 180ms ease;
    }

    .user-menu-link:hover {
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
    }

    .user-menu-logout:hover,
    .mobile-logout:hover {
      color: #fca5a5;
    }

    .utility-button,
    .theme-toggle,
    .mobile-menu-button {
      color: var(--cc-text-muted);
      transition:
        background-color 200ms ease,
        color 200ms ease,
        border-color 200ms ease;
    }

    .utility-button {
      min-height: 34px;
      padding: 0 0.45rem;
      border-radius: 0.5rem;
      font-size: 0.6875rem;
      font-weight: 700;
    }

    .utility-button:hover,
    .theme-toggle:hover,
    .mobile-menu-button:hover {
      color: var(--cc-text-secondary);
      background: var(--cc-bg-soft);
    }

    .theme-toggle,
    .mobile-menu-button {
      display: inline-flex;
      width: 32px;
      height: 32px;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 0.5rem;
      background: var(--cc-bg-elevated);
    }

    .language-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 130px;
      padding: 0.35rem;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 0.65rem;
      background: var(--cc-bg-card);
      box-shadow: var(--cc-shadow-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .language-option {
      display: block;
      width: 100%;
      padding: 0.55rem 0.65rem;
      border-radius: 0.4rem;
      color: var(--cc-text-muted);
      font-size: 0.75rem;
      text-align: left;
      transition:
        background-color 180ms ease,
        color 180ms ease;
    }

    .language-option:hover,
    .language-option-active {
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
    }

    .mobile-menu {
      border-top: 1px solid var(--cc-border-subtle);
      background: var(--cc-bg-header);
      box-shadow: var(--cc-shadow-card);
    }

    .mobile-link {
      display: block;
      border-radius: 0.625rem;
      padding: 0.75rem;
      color: var(--cc-text-secondary);
      font-size: 0.875rem;
      font-weight: 600;
      transition:
        background-color 180ms ease,
        color 180ms ease;
    }

    .mobile-link-with-icon {
      display: flex;
      align-items: center;
      gap: 0.55rem;
    }

    .mobile-link:hover {
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
    }

    .mobile-user-summary {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 0.5rem;
      padding: 0.7rem;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 0.75rem;
      background: var(--cc-bg-soft);
    }

    .mobile-logout {
      width: 100%;
      color: var(--cc-text-secondary);
      text-align: left;
    }

    .mobile-language-button,
    .mobile-login-link {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--cc-text-muted);
      font-size: 0.75rem;
      font-weight: 700;
      transition: color 180ms ease;
    }

    .mobile-language-button:hover,
    .mobile-login-link:hover {
      color: var(--cc-text-primary);
    }

    .mobile-language-option {
      min-height: 36px;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 0.5rem;
      color: var(--cc-text-muted);
      font-size: 0.75rem;
      font-weight: 600;
      transition:
        background-color 180ms ease,
        color 180ms ease;
    }

    .mobile-language-option:hover,
    .mobile-language-option-active {
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
    }

    @media (min-width: 1024px) and (max-width: 1279px) {
      .nav-link {
        padding: 0 0.42rem;
        font-size: 0.75rem;
      }

      .login-link,
      .user-menu-trigger {
        font-size: 0.75rem;
      }

      .create-club-button {
        padding: 0 0.65rem;
        font-size: 0.75rem;
      }

      .user-name {
        max-width: 72px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .nav-link,
      .login-link,
      .user-menu-trigger,
      .create-club-button,
      .utility-button,
      .theme-toggle,
      .mobile-menu-button,
      .language-option,
      .user-menu-link,
      .mobile-link,
      .mobile-language-button,
      .mobile-login-link,
      .mobile-language-option {
        transition: none;
      }
    }
  `,
})
export class NavbarComponent {
  readonly ChevronDown = ChevronDown;
  readonly Globe2 = Globe2;
  readonly LogIn = LogIn;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly Moon = Moon;
  readonly Settings = Settings;
  readonly Sun = Sun;
  readonly UserRound = UserRound;
  readonly X = X;

  readonly isMobileMenuOpen = signal(false);
  readonly isLanguageMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
  readonly selectedLanguage = signal<'PT' | 'EN'>('PT');

  readonly authService = inject(AuthService);

  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
    this.isLanguageMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen.update((isOpen) => !isOpen);
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
    this.isLanguageMenuOpen.set(false);
  }

  selectLanguage(language: 'PT' | 'EN'): void {
    this.selectedLanguage.set(language);
    this.isLanguageMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  userInitials(): string {
    const name = this.authService.currentUser()?.name?.trim();

    if (!name) {
      return 'CC';
    }

    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');

    return initials || 'CC';
  }

  logout(): void {
    this.closeMenus();
    this.authService.logout();
  }

  scrollToHome(event: Event): void {
    event.preventDefault();
    this.closeMenus();

    if (this.isOnHomePage()) {
      this.scrollToSectionById('inicio');
      return;
    }

    this.router.navigate(['/'], {
      fragment: 'inicio',
    });
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.closeMenus();

    if (this.isOnHomePage()) {
      this.scrollToSectionById(sectionId);
      return;
    }

    this.router.navigate(['/'], {
      fragment: sectionId,
    });
  }

  closeMenus(): void {
    this.isMobileMenuOpen.set(false);
    this.isLanguageMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  private scrollToSectionById(sectionId: string): void {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private isOnHomePage(): boolean {
    return window.location.pathname === '/';
  }
}
