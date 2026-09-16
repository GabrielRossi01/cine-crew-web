import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  CircleDollarSign,
  Clapperboard,
  Layers,
  Link2,
  LucideAngularModule,
  ShieldCheck,
  Trophy,
} from 'lucide-angular';

import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';

interface ClubJourneyStep {
  number: string;
  title: string;
  description: string;
  state: 'completed' | 'current' | 'locked';
  color: 'blue' | 'yellow' | 'green' | 'pink' | 'purple';
}

@Component({
  selector: 'app-clubs-overview',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="clubs-overview-page">
      <section class="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div class="relative mx-auto max-w-3xl text-center">
          <span class="section-eyebrow"> Clubes privados para sua crew </span>

          <h1
            class="mt-5 font-sora text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-[var(--cc-text-primary)] sm:text-5xl"
          >
            Clubes: a sua crew, num só lugar.
          </h1>

          <p
            class="mx-auto mt-5 max-w-xl text-sm leading-6 text-[var(--cc-text-muted)] sm:text-base sm:leading-7"
          >
            Crie um espaço privado para a sua turma, envie convites por link e organize todas as
            idas ao cinema sem depender de grupo de WhatsApp.
          </p>

          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              routerLink="/register"
              class="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FFC250] px-6 text-sm font-bold text-[#111827] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd477]"
            >
              Criar meu clube

              <lucide-icon
                [img]="ArrowRight"
                [size]="17"
                strokeWidth="2.2"
                class="transition-transform duration-300 group-hover:translate-x-1"
              ></lucide-icon>
            </a>

            <a
              routerLink="/login"
              class="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--cc-border-strong)] bg-[var(--cc-bg-elevated)] px-6 text-sm font-semibold text-[var(--cc-text-primary)] backdrop-blur-xl transition-all duration-300 hover:border-[#2B4393]/80 hover:bg-[#2B4393]/20"
            >
              Já tenho conta
            </a>
          </div>
        </div>
      </section>

      <section class="border-t border-[var(--cc-border-subtle)] px-5 py-20 sm:px-8 lg:px-12">
        <div class="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span class="section-eyebrow"> Como funciona </span>

            <h2
              class="mt-3 font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
            >
              Um espaço privado só para sua turma.
            </h2>

            <p class="mt-4 text-sm leading-6 text-[var(--cc-text-muted)] sm:text-base sm:leading-7">
              Cada clube é isolado dos demais: apenas quem recebe o convite entra. Dentro dele, sua
              crew combina sessões, controla pagamentos e acumula memórias e pontos ao longo do
              tempo.
            </p>

            <ul class="mt-6 flex flex-col gap-3 text-sm text-[var(--cc-text-secondary)]">
              <li class="flex items-start gap-3">
                <lucide-icon
                  [img]="ShieldCheck"
                  [size]="17"
                  class="mt-0.5 text-[var(--cc-icon-primary)]"
                ></lucide-icon>

                Grupos privados, sem visibilidade pública.
              </li>

              <li class="flex items-start gap-3">
                <lucide-icon
                  [img]="Link2"
                  [size]="17"
                  class="mt-0.5 text-[var(--cc-icon-primary)]"
                ></lucide-icon>

                Convite feito por link, sem burocracia.
              </li>

              <li class="flex items-start gap-3">
                <lucide-icon
                  [img]="CircleDollarSign"
                  [size]="17"
                  class="mt-0.5 text-[var(--cc-icon-primary)]"
                ></lucide-icon>

                Rachadinha organizada dentro do próprio clube.
              </li>
            </ul>
          </div>

          <div class="relative mx-auto w-full max-w-[360px]">
            <div class="club-summary-card">
              <div class="flex items-center gap-2 border-b border-[var(--cc-border-subtle)] pb-3">
                <div class="club-summary-icon">
                  <lucide-icon [img]="Clapperboard" [size]="17"></lucide-icon>
                </div>

                <div>
                  <p class="text-sm font-semibold text-[var(--cc-text-primary)]">Sexta da Crew</p>

                  <p class="text-[11px] text-[var(--cc-text-muted)]">8 participantes</p>
                </div>
              </div>

              <div class="club-summary-invite">
                <span class="text-xs text-[var(--cc-text-muted)]"> Convite ativo </span>

                <span class="club-summary-code"> cinecrew.app/j/8fk2 </span>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2.5">
                <div class="club-summary-metric">
                  <div class="flex items-center gap-1.5 text-[#FFC250]">
                    <lucide-icon [img]="CircleDollarSign" [size]="15"></lucide-icon>

                    <span class="text-[11px] font-semibold"> Pagamentos </span>
                  </div>

                  <p class="mt-2 text-base font-bold text-[var(--cc-text-primary)]">6 de 8</p>
                </div>

                <div class="club-summary-metric">
                  <div class="flex items-center gap-1.5 text-[var(--cc-icon-primary)]">
                    <lucide-icon [img]="Trophy" [size]="15"></lucide-icon>

                    <span class="text-[11px] font-semibold"> Ranking </span>
                  </div>

                  <p class="mt-2 text-base font-bold text-[var(--cc-text-primary)]">#01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="club-flow-section">
        <div class="mx-auto max-w-7xl">
          <header class="journey-section-header">
            <span class="section-eyebrow"> Do grupo para a tela grande </span>

            <h2
              class="mt-4 font-sora text-3xl font-semibold tracking-[-0.04em] text-[var(--cc-text-primary)] sm:text-4xl"
            >
              Um clube para transformar ideia em rolê.
            </h2>

            <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--cc-text-secondary)]">
              Da primeira mensagem ao registro da sessão, o CineCrew acompanha cada etapa para que
              sua crew aproveite mais e organize menos.
            </p>

            <div class="journey-progress-summary">
              <span>Jornada da crew</span>

              <div class="journey-progress-track">
                <span></span>
              </div>

              <strong>3 de 5 etapas</strong>
            </div>
          </header>

          <div class="journey-canvas">
            @for (step of clubJourney; track step.number; let index = $index) {
              <article
                class="journey-step"
                [class.journey-step-completed]="step.state === 'completed'"
                [class.journey-step-current]="step.state === 'current'"
                [class.journey-step-locked]="step.state === 'locked'"
              >
                <div
                  class="journey-node"
                  [class.journey-node-blue]="step.color === 'blue'"
                  [class.journey-node-yellow]="step.color === 'yellow'"
                  [class.journey-node-green]="step.color === 'green'"
                  [class.journey-node-pink]="step.color === 'pink'"
                  [class.journey-node-purple]="step.color === 'purple'"
                >
                  <lucide-icon [img]="Layers" [size]="26" strokeWidth="1.8"></lucide-icon>

                  <span class="journey-node-number">
                    {{ step.number }}
                  </span>
                </div>

                <div class="journey-step-content">
                  <span class="journey-number"> Etapa {{ step.number }} </span>

                  <h3>
                    {{ step.title }}
                  </h3>

                  <p>
                    {{ step.description }}
                  </p>

                  @if (step.state === 'completed') {
                    <span class="journey-state journey-state-completed"> Concluído </span>
                  } @else if (step.state === 'current') {
                    <span class="journey-state journey-state-current"> Próximo passo </span>
                  } @else {
                    <span class="journey-state journey-state-locked"> Em breve </span>
                  }
                </div>

                @if (index < clubJourney.length - 1) {
                  <div
                    class="journey-arrow"
                    [class.journey-arrow-completed]="step.state === 'completed'"
                    [class.journey-arrow-current]="step.state === 'current'"
                    aria-hidden="true"
                  >
                    <span class="journey-arrow-line"></span>
                    <span class="journey-arrow-head"></span>
                  </div>
                }
              </article>
            }
          </div>
        </div>
      </section>

      <section
        class="border-t border-[var(--cc-border-subtle)] px-5 py-20 text-center sm:px-8 lg:px-12"
      >
        <div class="mx-auto max-w-xl">
          <h2
            class="font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
          >
            Pronto para reunir sua crew?
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
            Criar um clube é grátis e leva menos de um minuto.
          </p>

          <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              routerLink="/register"
              class="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#FFC250] px-6 text-sm font-bold text-[#111827] transition-all duration-300 hover:bg-[#ffd477]"
            >
              Criar meu clube
            </a>

            <a
              routerLink="/login"
              class="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--cc-border-strong)] bg-[var(--cc-bg-elevated)] px-6 text-sm font-semibold text-[var(--cc-text-primary)]"
            >
              Entrar
            </a>
          </div>
        </div>
      </section>
    </main>

    <app-footer></app-footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .clubs-overview-page {
      background: var(--cc-bg-base);
    }

    .section-eyebrow {
      align-items: center;
      gap: 0.55rem;
      color: var(--journey-eyebrow);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      line-height: 1;
      text-transform: uppercase;
    }

    .section-eyebrow::before {
      width: 1.8rem;
      height: 1px;
      background: currentColor;
      content: '';
      opacity: 0.7;
    }

    .club-summary-card {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--journey-glass-border);
      border-radius: 1.75rem;
      padding: 1rem;
      background: var(--journey-glass-surface);
      box-shadow:
        0 24px 65px var(--journey-shadow),
        inset 0 1px 0 var(--journey-highlight);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .club-summary-icon {
      display: flex;
      width: 2.25rem;
      height: 2.25rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.65rem;
      color: white;
      background: #2b4393;
    }

    .club-summary-invite {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: 1rem;
      border: 1px solid var(--journey-card-border);
      border-radius: 0.75rem;
      padding: 0.75rem;
      background: var(--journey-card-surface);
    }

    .club-summary-code {
      overflow: hidden;
      border-radius: 9999px;
      padding: 0.3rem 0.6rem;
      color: #ffc250;
      background: rgba(255, 194, 80, 0.1);
      font-size: 0.6rem;
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .club-summary-metric {
      border: 1px solid var(--journey-card-border);
      border-radius: 0.75rem;
      padding: 0.75rem;
      background: var(--journey-card-surface);
    }

    .club-flow-section {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      border-top: 1px solid var(--cc-border-subtle);
      padding: 7rem 1.25rem 6rem;
      background: var(--cc-bg-base);
    }

    .club-flow-section::before {
      position: absolute;
      top: 10%;
      left: 50%;
      width: 46rem;
      height: 16rem;
      border: 1px solid var(--journey-orbit);
      border-radius: 9999px;
      content: '';
      opacity: 0.32;
      pointer-events: none;
      transform: translateX(-50%) rotate(-8deg);
    }

    .club-flow-section::after {
      position: absolute;
      right: -12rem;
      bottom: -12rem;
      width: 30rem;
      height: 30rem;
      border: 1px solid var(--journey-orbit);
      border-radius: 9999px;
      content: '';
      opacity: 0.24;
      pointer-events: none;
    }

    .club-flow-section > div {
      position: relative;
      z-index: 1;
    }

    .journey-section-header {
      max-width: 48rem;
      margin: 0 auto;
      text-align: center;
    }

    .journey-section-header .section-eyebrow {
      justify-content: center;
    }

    .journey-progress-summary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 2rem;
      color: var(--cc-text-muted);
      font-size: 0.7rem;
      font-weight: 700;
    }

    .journey-progress-summary strong {
      color: var(--journey-progress-text);
      font-size: 0.7rem;
      font-weight: 800;
    }

    .journey-progress-track {
      width: 6rem;
      height: 0.35rem;
      overflow: hidden;
      border-radius: 9999px;
      background: var(--journey-progress-background);
    }

    .journey-progress-track span {
      display: block;
      width: 60%;
      height: 100%;
      border-radius: inherit;
      background: var(--journey-progress-fill);
    }

    .journey-canvas {
      position: relative;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 1rem;
      max-width: 76rem;
      min-height: 25rem;
      margin: 5rem auto 0;
      padding: 0 1rem;
    }

    .journey-step {
      position: relative;
      display: flex;
      min-width: 0;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .journey-node {
      position: relative;
      z-index: 2;
      display: flex;
      width: 5.6rem;
      height: 5.6rem;
      align-items: center;
      justify-content: center;
      border: 0.45rem solid var(--journey-node-ring);
      border-radius: 1.35rem;
      color: var(--journey-node-color);
      background: var(--journey-node-surface);
      box-shadow:
        0 12px 28px var(--journey-node-shadow),
        inset 0 1px 0 var(--journey-highlight);
      transition:
        transform 280ms ease,
        box-shadow 280ms ease,
        border-color 280ms ease;
    }

    .journey-node::before {
      position: absolute;
      inset: 0.45rem;
      border: 1px solid var(--journey-node-inner-border);
      border-radius: 0.9rem;
      content: '';
      pointer-events: none;
    }

    .journey-step:hover .journey-node {
      box-shadow:
        0 14px 34px var(--journey-node-shadow),
        0 0 0 0.45rem var(--journey-node-hover-ring);
      transform: translateY(-4px) scale(1.06);
    }

    .journey-step-current .journey-node {
      width: 6.2rem;
      height: 6.2rem;
      border-width: 0.5rem;
      box-shadow:
        0 16px 36px var(--journey-node-shadow),
        0 0 0 0.5rem var(--journey-current-ring);
    }

    .journey-step-locked {
      opacity: 0.52;
    }

    .journey-node-number {
      position: absolute;
      right: -0.4rem;
      bottom: -0.4rem;
      z-index: 3;
      display: flex;
      width: 1.55rem;
      height: 1.55rem;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--cc-bg-base);
      border-radius: 9999px;
      color: var(--journey-number-text);
      background: var(--journey-number-surface);
      font-size: 0.7rem;
      font-weight: 900;
    }

    .journey-step-completed .journey-node-number {
      color: var(--journey-completed-number-text);
      background: var(--journey-completed-number-surface);
    }

    .journey-step-current .journey-node-number {
      color: var(--journey-current-number-text);
      background: var(--journey-current-number-surface);
    }

    .journey-step-content {
      max-width: 12rem;
      margin-top: 1.5rem;
    }

    .journey-number {
      color: var(--cc-text-muted);
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .journey-step-content h3 {
      margin-top: 0.4rem;
      color: var(--cc-text-primary);
      font-family: var(--cc-font-sora, sans-serif);
      font-size: 0.95rem;
      font-weight: 800;
    }

    .journey-step-content p {
      margin-top: 0.45rem;
      color: var(--cc-text-muted);
      font-size: 0.72rem;
      line-height: 1.5;
    }

    .journey-state {
      display: inline-flex;
      margin-top: 0.85rem;
      border: 1px solid;
      border-radius: 9999px;
      padding: 0.3rem 0.6rem;
      font-size: 0.6rem;
      font-weight: 800;
    }

    .journey-state-completed {
      border-color: var(--journey-completed-border);
      color: var(--journey-completed-text);
      background: var(--journey-completed-surface);
    }

    .journey-state-current {
      border-color: var(--journey-current-border);
      color: var(--journey-current-text);
      background: var(--journey-current-surface);
    }

    .journey-state-locked {
      border-color: var(--journey-locked-border);
      color: var(--journey-locked-text);
      background: var(--journey-locked-surface);
    }

    .journey-arrow {
      position: absolute;
      top: 2.8rem;
      right: -1.8rem;
      z-index: 1;
      width: 4rem;
      height: 0.75rem;
      pointer-events: none;
    }

    .journey-arrow-line {
      position: absolute;
      top: 50%;
      right: 0.55rem;
      left: 0;
      height: 1px;
      border-top: 1px solid var(--journey-arrow-color);
      opacity: 0.95;
      transform: translateY(-50%);
    }

    .journey-arrow-head {
      position: absolute;
      top: 50%;
      right: 0;
      width: 0.6rem;
      height: 0.6rem;
      border-top: 1px solid var(--journey-arrow-color);
      border-right: 1px solid var(--journey-arrow-color);
      transform: translateY(-50%) rotate(45deg);
    }

    .journey-arrow-completed {
      --journey-arrow-color: var(--journey-arrow-completed-color);
    }

    .journey-arrow-current {
      --journey-arrow-color: var(--journey-arrow-current-color);
    }

    .journey-arrow:not(.journey-arrow-completed):not(.journey-arrow-current) {
      --journey-arrow-color: var(--journey-arrow-locked-color);
    }

    .journey-section-footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 56rem;
      margin: 4rem auto 0;
    }

    .journey-footer-decoration {
      height: 1px;
      flex: 1;
      background: var(--journey-footer-border);
    }

    .journey-footer-message {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--cc-text-muted);
      font-size: 0.72rem;
      text-align: center;
    }

    .journey-footer-icon {
      display: flex;
      width: 1.8rem;
      height: 1.8rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--journey-footer-icon-border);
      border-radius: 0.6rem;
      color: var(--journey-footer-icon-color);
      background: var(--journey-footer-icon-surface);
    }

    .journey-node-blue {
      --journey-node-color: var(--journey-node-color-blue);
      --journey-node-surface: var(--journey-node-surface-blue);
    }

    .journey-node-yellow {
      --journey-node-color: var(--journey-node-color-yellow);
      --journey-node-surface: var(--journey-node-surface-yellow);
    }

    .journey-node-green {
      --journey-node-color: var(--journey-node-color-green);
      --journey-node-surface: var(--journey-node-surface-green);
    }

    .journey-node-pink {
      --journey-node-color: var(--journey-node-color-pink);
      --journey-node-surface: var(--journey-node-surface-pink);
    }

    .journey-node-purple {
      --journey-node-color: var(--journey-node-color-purple);
      --journey-node-surface: var(--journey-node-surface-purple);
    }

    :host-context(.dark) {
      --journey-eyebrow: #ffc250;
      --journey-orbit: rgba(255, 255, 255, 0.08);
      --journey-glass-border: rgba(255, 255, 255, 0.15);
      --journey-glass-surface: rgba(255, 255, 255, 0.035);
      --journey-card-border: rgba(255, 255, 255, 0.12);
      --journey-card-surface: rgba(255, 255, 255, 0.035);
      --journey-highlight: rgba(255, 255, 255, 0.14);
      --journey-shadow: rgba(0, 0, 0, 0.32);
      --journey-progress-text: #ffc250;
      --journey-progress-background: rgba(255, 255, 255, 0.08);
      --journey-progress-fill: #ffc250;
      --journey-arrow-completed-color: #ffffff;
      --journey-arrow-current-color: #ffffff;
      --journey-arrow-locked-color: rgba(255, 255, 255, 0.55);
      --journey-node-ring: rgba(255, 255, 255, 0.12);
      --journey-node-inner-border: rgba(255, 255, 255, 0.12);
      --journey-node-shadow: rgba(0, 0, 0, 0.3);
      --journey-node-hover-ring: rgba(255, 255, 255, 0.18);
      --journey-current-ring: rgba(255, 255, 255, 0.2);
      --journey-number-text: #111827;
      --journey-number-surface: #ffc250;
      --journey-completed-number-text: #052e1a;
      --journey-completed-number-surface: #74e0ad;
      --journey-current-number-text: #111827;
      --journey-current-number-surface: #ffc250;
      --journey-footer-border: rgba(255, 255, 255, 0.1);
      --journey-footer-icon-border: rgba(255, 194, 80, 0.25);
      --journey-footer-icon-color: #ffc250;
      --journey-footer-icon-surface: rgba(255, 194, 80, 0.08);
      --journey-completed-border: rgba(66, 211, 146, 0.3);
      --journey-completed-text: #74e0ad;
      --journey-completed-surface: rgba(66, 211, 146, 0.1);
      --journey-current-border: rgba(255, 194, 80, 0.42);
      --journey-current-text: #ffc250;
      --journey-current-surface: rgba(255, 194, 80, 0.1);
      --journey-locked-border: rgba(255, 255, 255, 0.12);
      --journey-locked-text: rgba(255, 255, 255, 0.5);
      --journey-locked-surface: rgba(255, 255, 255, 0.04);
      --journey-node-color-blue: #9db2ff;
      --journey-node-surface-blue: rgba(123, 156, 255, 0.16);
      --journey-node-color-yellow: #ffc250;
      --journey-node-surface-yellow: rgba(255, 194, 80, 0.16);
      --journey-node-color-green: #74e0ad;
      --journey-node-surface-green: rgba(66, 211, 146, 0.16);
      --journey-node-color-pink: #f4a6c1;
      --journey-node-surface-pink: rgba(244, 166, 193, 0.16);
      --journey-node-color-purple: #c3a6ff;
      --journey-node-surface-purple: rgba(157, 123, 255, 0.16);
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --journey-eyebrow: #2b4393;
      --journey-orbit: rgba(43, 67, 147, 0.12);
      --journey-glass-border: rgba(20, 31, 58, 0.16);
      --journey-glass-surface: rgba(255, 255, 255, 0.48);
      --journey-card-border: rgba(20, 31, 58, 0.12);
      --journey-card-surface: rgba(255, 255, 255, 0.4);
      --journey-highlight: rgba(255, 255, 255, 0.88);
      --journey-shadow: rgba(34, 48, 78, 0.14);
      --journey-progress-text: #2b4393;
      --journey-progress-background: rgba(43, 67, 147, 0.1);
      --journey-progress-fill: #2b4393;
      --journey-arrow-completed-color: #ffffff;
      --journey-arrow-current-color: #ffffff;
      --journey-arrow-locked-color: rgba(255, 255, 255, 0.7);
      --journey-node-ring: rgba(43, 67, 147, 0.13);
      --journey-node-inner-border: rgba(255, 255, 255, 0.65);
      --journey-node-shadow: rgba(34, 48, 78, 0.16);
      --journey-node-hover-ring: rgba(43, 67, 147, 0.14);
      --journey-current-ring: rgba(43, 67, 147, 0.16);
      --journey-number-text: #ffffff;
      --journey-number-surface: #2b4393;
      --journey-completed-number-text: #ffffff;
      --journey-completed-number-surface: #167b4b;
      --journey-current-number-text: #111827;
      --journey-current-number-surface: #ffc250;
      --journey-footer-border: rgba(43, 67, 147, 0.12);
      --journey-footer-icon-border: rgba(43, 67, 147, 0.2);
      --journey-footer-icon-color: #2b4393;
      --journey-footer-icon-surface: rgba(43, 67, 147, 0.08);
      --journey-completed-border: rgba(22, 123, 75, 0.22);
      --journey-completed-text: #167b4b;
      --journey-completed-surface: rgba(22, 123, 75, 0.08);
      --journey-current-border: rgba(173, 119, 16, 0.32);
      --journey-current-text: #8b610e;
      --journey-current-surface: rgba(255, 194, 80, 0.16);
      --journey-locked-border: rgba(43, 67, 147, 0.13);
      --journey-locked-text: #71809a;
      --journey-locked-surface: rgba(43, 67, 147, 0.05);
      --journey-node-color-blue: #2b4393;
      --journey-node-surface-blue: rgba(43, 67, 147, 0.1);
      --journey-node-color-yellow: #ad7710;
      --journey-node-surface-yellow: rgba(255, 194, 80, 0.2);
      --journey-node-color-green: #167b4b;
      --journey-node-surface-green: rgba(22, 123, 75, 0.1);
      --journey-node-color-pink: #a54568;
      --journey-node-surface-pink: rgba(165, 69, 104, 0.1);
      --journey-node-color-purple: #6541ad;
      --journey-node-surface-purple: rgba(101, 65, 173, 0.1);
    }

    @media (max-width: 767px) {
      .club-flow-section {
        padding: 5rem 1.25rem;
      }

      .journey-progress-summary {
        flex-wrap: wrap;
        justify-content: center;
      }

      .journey-canvas {
        display: flex;
        min-height: 0;
        flex-direction: column;
        gap: 0;
        margin-top: 3.5rem;
        padding: 0 0.5rem;
      }

      .journey-step {
        display: grid;
        grid-template-columns: 4.8rem 1fr;
        width: 100%;
        min-height: 7rem;
        align-items: start;
        gap: 0.9rem;
        text-align: left;
      }

      .journey-step-current {
        min-height: 8rem;
      }

      .journey-node,
      .journey-step-current .journey-node {
        width: 4.5rem;
        height: 4.5rem;
        border-width: 0.35rem;
        border-radius: 1.1rem;
      }

      .journey-node-number {
        right: -0.3rem;
        bottom: -0.3rem;
        width: 1.4rem;
        height: 1.4rem;
        font-size: 0.62rem;
      }

      .journey-step-content {
        max-width: none;
        margin-top: 0.35rem;
      }

      .journey-step-content h3 {
        font-size: 0.9rem;
      }

      .journey-step-content p {
        max-width: 16rem;
        font-size: 0.7rem;
      }

      .journey-arrow {
        top: 4.5rem;
        right: auto;
        left: 2.05rem;
        width: 0.75rem;
        height: 2.8rem;
      }

      .journey-arrow-line {
        top: 0;
        right: auto;
        bottom: 0.55rem;
        left: 50%;
        width: 1px;
        height: auto;
        border-top: 0;
        border-left: 1px solid var(--journey-arrow-color);
        transform: translateX(-50%);
      }

      .journey-arrow-head {
        top: auto;
        right: auto;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) rotate(135deg);
      }

      .journey-section-footer {
        margin-top: 2.5rem;
      }

      .journey-footer-decoration {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .journey-node,
      .journey-arrow {
        transition: none;
      }
    }

    @supports not (backdrop-filter: blur(1px)) {
      .club-summary-card {
        background: var(--journey-fallback-surface);
      }
    }

    :host-context(.dark) {
      --journey-fallback-surface: rgba(255, 255, 255, 0.08);
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --journey-fallback-surface: rgba(255, 255, 255, 0.78);
    }
  `,
})
export class ClubsOverviewComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly ArrowRight = ArrowRight;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Clapperboard = Clapperboard;
  readonly Layers = Layers;
  readonly Link2 = Link2;
  readonly ShieldCheck = ShieldCheck;
  readonly Trophy = Trophy;

  readonly clubJourney: ClubJourneyStep[] = [
    {
      number: '1',
      title: 'Convide sua crew',
      description: 'Chame sua turma por um link privado e reúna todo mundo no mesmo clube.',
      state: 'completed',
      color: 'blue',
    },
    {
      number: '2',
      title: 'Escolham o filme',
      description: 'Encontrem juntos o próximo filme para assistir no cinema.',
      state: 'completed',
      color: 'yellow',
    },
    {
      number: '3',
      title: 'Marquem a sessão',
      description: 'Definam data, cinema e quem vai participar do rolê.',
      state: 'current',
      color: 'green',
    },
    {
      number: '4',
      title: 'Dividam os ingressos',
      description: 'Cada pessoa sabe exatamente sua parte na rachadinha.',
      state: 'locked',
      color: 'purple',
    },
    {
      number: '5',
      title: 'Guardem a memória',
      description: 'Compartilhem fotos e transformem a sessão em uma memória da crew.',
      state: 'locked',
      color: 'pink',
    },
  ];

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Clubes | CineCrew',
      description:
        'Crie clubes privados, convide sua turma por link e organize rachadinhas, ranking e memórias das idas ao cinema.',
    });
  }
}
