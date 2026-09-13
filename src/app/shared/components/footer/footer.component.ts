import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowUp, Instagram, LucideAngularModule, Mail, MessageCircle } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer
      class="relative overflow-hidden border-t border-[var(--cc-border-subtle)] bg-[var(--cc-bg-base)] px-5 py-12 text-[var(--cc-text-primary)] sm:px-8 lg:px-12"
    >
      <div class="relative mx-auto max-w-7xl">
        <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div class="max-w-sm">
            <a
              routerLink="/"
              fragment="inicio"
              class="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)]"
              aria-label="CineCrew - Voltar ao início"
              (click)="scrollToHome($event)"
            >
              <img src="cine-crew-logo.svg" alt="CineCrew" class="h-10 w-auto object-contain" />
            </a>

            <p class="mt-5 text-sm leading-6 text-[var(--cc-text-muted)]">
              Your Crew. Your Screen.
            </p>
          </div>

          <div>
            <h2 class="footer-title">Produto</h2>

            <nav class="mt-4 flex flex-col gap-3" aria-label="Links do produto">
              <a
                routerLink="/"
                fragment="inicio"
                class="footer-link"
                (click)="scrollToSection($event, 'inicio')"
              >
                Início
              </a>

              <a routerLink="/clubes" class="footer-link">Clubes</a>
              <a routerLink="/recursos" class="footer-link">Recursos</a>
            </nav>
          </div>

          <div>
            <h2 class="footer-title">Sua conta</h2>

            <nav class="mt-4 flex flex-col gap-3" aria-label="Links da conta">
              <a routerLink="/login" class="footer-link"> Entrar </a>

              <a routerLink="/register" class="footer-link"> Criar clube </a>
            </nav>
          </div>
        </div>

        <div
          class="mt-12 flex flex-col gap-3 border-t border-[var(--cc-border-subtle)] pt-6 text-xs text-[var(--cc-text-subtle)] sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ currentYear }} CineCrew. Todos os direitos reservados.</p>

          <div class="flex items-center gap-4">
            <a href="#" class="legal-link">Privacidade</a>
            <a href="#" class="legal-link">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .footer-title {
      color: var(--cc-text-primary);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .footer-link,
    .legal-link {
      color: var(--cc-text-muted);
      font-size: 0.8rem;
      transition:
        color 200ms ease,
        transform 200ms ease;
    }

    .footer-link:hover,
    .legal-link:hover {
      color: var(--cc-text-primary);
    }

    .footer-link:hover {
      transform: translateX(2px);
    }

    @media (prefers-reduced-motion: reduce) {
      .footer-link,
      .legal-link,
      .social-link {
        transition: none;
      }
    }
  `,
})
export class FooterComponent {
  readonly ArrowUp = ArrowUp;
  readonly Instagram = Instagram;
  readonly Mail = Mail;
  readonly MessageCircle = MessageCircle;

  readonly currentYear = new Date().getFullYear();

  scrollToHome(event: Event): void {
    event.preventDefault();

    if (this.isOnHomePage()) {
      this.scrollToSectionById('inicio');
      return;
    }

    window.location.href = '/#inicio';
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    if (this.isOnHomePage()) {
      this.scrollToSectionById(sectionId);
      return;
    }

    window.location.href = `/#${sectionId}`;
  }

  private scrollToSectionById(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private isOnHomePage(): boolean {
    return window.location.pathname === '/';
  }
}
