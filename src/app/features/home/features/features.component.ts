import { Component } from '@angular/core';
import { Camera, Link2, LucideAngularModule, Trophy, Wallet } from 'lucide-angular';

interface ClubFeature {
  icon: typeof Link2;
  title: string;
  description: string;
  rotation: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section class="features-section px-5 py-24 sm:px-8">
      <div class="mx-auto max-w-6xl text-center">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#FFC250]">
          Dentro do clube
        </p>

        <h2 class="font-sora text-3xl font-bold text-[var(--cc-text-primary)] sm:text-4xl">
          O que você organiza dentro do clube.
        </h2>

        <p
          class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--cc-text-secondary)] sm:text-base"
        >
          Tudo o que a sua crew precisa para decidir, pagar e guardar cada ida ao cinema em um só
          lugar.
        </p>
      </div>

      <div class="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        @for (feature of features; track feature.title) {
          <article
            class="feature-card group"
            [style.transform]="'rotate(' + feature.rotation + ')'"
          >
            <div class="feature-icon">
              <lucide-icon [img]="feature.icon" [size]="21" strokeWidth="1.8"></lucide-icon>
            </div>

            <h3 class="feature-title">
              {{ feature.title }}
            </h3>

            <p class="feature-description">
              {{ feature.description }}
            </p>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .features-section {
      background: var(--cc-features-bg);
      transition: background-color 250ms ease;
    }

    .feature-card {
      position: relative;
      display: flex;
      min-height: 220px;
      flex-direction: column;
      gap: 0.75rem;
      overflow: hidden;
      border: 1px solid var(--cc-glass-border);
      border-radius: 1.35rem;
      padding: 1.75rem 1.5rem;
      background: var(--cc-glass-surface);
      background-clip: padding-box;
      box-shadow:
        0 18px 42px var(--cc-glass-drop-shadow),
        inset 0 1px 0 var(--cc-glass-highlight);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      isolation: isolate;
      transform: translateZ(0);
      transition:
        transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
        border-color 300ms ease,
        box-shadow 300ms ease,
        background 300ms ease;
      will-change: transform;
    }

    .feature-card::after {
      position: absolute;
      inset: 0;
      border: 1px solid var(--cc-glass-inner-border);
      border-radius: inherit;
      content: '';
      pointer-events: none;
    }

    .feature-card:hover {
      transform: rotate(0deg) translate3d(0, -6px, 0) scale(1.01) !important;
      border-color: var(--cc-glass-hover-border);
      background: var(--cc-glass-hover-surface);
      box-shadow:
        0 24px 52px var(--cc-glass-hover-shadow),
        inset 0 1px 0 var(--cc-glass-hover-highlight);
    }

    .feature-icon {
      position: relative;
      z-index: 1;
      display: inline-flex;
      width: 2.8rem;
      height: 2.8rem;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-glass-icon-border);
      border-radius: 0.9rem;
      color: var(--cc-accent-primary);
      background: var(--cc-glass-icon-surface);
      box-shadow: inset 1px 1px 0 var(--cc-glass-highlight);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      transition:
        color 300ms ease,
        background 300ms ease,
        transform 300ms ease;
    }

    .feature-card:hover .feature-icon {
      color: var(--cc-accent-hover);
      background: var(--cc-glass-icon-hover-surface);
      transform: translateY(-2px) scale(1.06);
    }

    .feature-title {
      position: relative;
      z-index: 1;
      color: var(--cc-text-primary);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .feature-description {
      position: relative;
      z-index: 1;
      flex: 1;
      color: var(--cc-text-secondary);
      font-size: 0.8125rem;
      line-height: 1.6;
    }

    :host-context(.dark) {
      --cc-features-bg: #0a0a0a;

      --cc-glass-border: rgba(255, 255, 255, 0.14);
      --cc-glass-inner-border: rgba(255, 255, 255, 0.045);
      --cc-glass-surface: rgba(255, 255, 255, 0.035);
      --cc-glass-hover-surface: rgba(255, 255, 255, 0.06);
      --cc-glass-highlight: rgba(255, 255, 255, 0.14);
      --cc-glass-drop-shadow: rgba(0, 0, 0, 0.3);
      --cc-glass-hover-border: rgba(255, 194, 80, 0.5);
      --cc-glass-hover-highlight: rgba(255, 255, 255, 0.2);
      --cc-glass-hover-shadow: rgba(0, 0, 0, 0.42);
      --cc-glass-icon-border: rgba(255, 255, 255, 0.17);
      --cc-glass-icon-surface: rgba(255, 194, 80, 0.07);
      --cc-glass-icon-hover-surface: rgba(255, 194, 80, 0.14);
      --cc-accent-primary: #ffc250;
      --cc-accent-hover: #fff2c7;
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --cc-features-bg: var(--cc-bg-base);

      --cc-glass-border: rgba(20, 31, 58, 0.16);
      --cc-glass-inner-border: rgba(255, 255, 255, 0.72);
      --cc-glass-surface: rgba(255, 255, 255, 0.5);
      --cc-glass-hover-surface: rgba(255, 255, 255, 0.68);
      --cc-glass-highlight: rgba(255, 255, 255, 0.88);
      --cc-glass-drop-shadow: rgba(34, 48, 78, 0.14);
      --cc-glass-hover-border: rgba(43, 67, 147, 0.42);
      --cc-glass-hover-highlight: rgba(255, 255, 255, 0.95);
      --cc-glass-hover-shadow: rgba(34, 48, 78, 0.2);
      --cc-glass-icon-border: rgba(43, 67, 147, 0.2);
      --cc-glass-icon-surface: rgba(43, 67, 147, 0.07);
      --cc-glass-icon-hover-surface: rgba(43, 67, 147, 0.14);
      --cc-accent-primary: #2b4393;
      --cc-accent-hover: #1e316e;
    }

    @media (max-width: 639px) {
      .feature-card {
        min-height: 200px;
        transform: none !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .feature-card,
      .feature-icon {
        transition: none;
      }
    }

    @supports not (backdrop-filter: blur(1px)) {
      .feature-card {
        background: rgba(255, 255, 255, 0.1);
      }

      .feature-icon {
        background: rgba(255, 255, 255, 0.14);
      }
    }
  `,
})
export class FeaturesComponent {
  readonly features: ClubFeature[] = [
    {
      icon: Link2,
      title: 'Convite por link',
      description: 'Compartilhe um link e sua turma entra no clube em segundos, sem burocracia.',
      rotation: '-3deg',
    },
    {
      icon: Wallet,
      title: 'Rachadinha',
      description:
        'Registre o valor dos ingressos e veja quem já pagou sua parte, sem Pix perdido no chat.',
      rotation: '2deg',
    },
    {
      icon: Trophy,
      title: 'Ranking interno',
      description:
        'Veja quem mais participa e organiza os rolês, e transforme presença em conquista.',
      rotation: '-2deg',
    },
    {
      icon: Camera,
      title: 'Memórias do clube',
      description: 'Fotos e comentários vinculados a cada sessão, criando o álbum da sua crew.',
      rotation: '3deg',
    },
  ];
}
