import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  Camera,
  CircleDollarSign,
  Film,
  Heart,
  LucideAngularModule,
  Search,
  Trophy,
  Users,
} from 'lucide-angular';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-features-overview',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />

    <main class="bg-[var(--cc-bg-base)] text-[var(--cc-text-primary)]">
      <section class="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div
          class="pointer-events-none absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-[#2B4393]/15 blur-[140px]"
          aria-hidden="true"
        ></div>

        <div class="relative mx-auto max-w-3xl text-center">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-[#FFC250]/25 bg-[#FFC250]/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFC250]"
          >
            Recursos CineCrew
          </span>

          <h1
            class="mt-5 font-sora text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-[var(--cc-text-primary)] sm:text-5xl"
          >
            Tudo que sua crew precisa, num só app.
          </h1>

          <p
            class="mx-auto mt-5 max-w-xl text-sm leading-6 text-[var(--cc-text-muted)] sm:text-base sm:leading-7"
          >
            Do convite ao clube até a última foto da sessão: conheça cada recurso que o CineCrew
            coloca à disposição da sua turma.
          </p>
        </div>
      </section>

      <section
        class="border-t border-[var(--cc-border-subtle)] px-5 py-20 sm:px-8 lg:px-12"
        aria-labelledby="features-timeline-title"
      >
        <div class="mx-auto max-w-4xl">
          <header class="mb-14 max-w-xl">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
              Conheça a plataforma
            </span>

            <h2
              id="features-timeline-title"
              class="mt-3 font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
            >
              Um recurso para cada etapa do rolê.
            </h2>

            <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
              Acompanhe a linha e descubra como o CineCrew simplifica a organização da sua turma.
            </p>
          </header>

          <div class="feature-timeline">
            <div class="feature-timeline-line" aria-hidden="true">
              <div class="feature-timeline-progress" [style.height.%]="progressPercentage()"></div>
            </div>

            <div class="flex flex-col gap-10 sm:gap-14">
              @for (item of allFeatures; track item.title; let index = $index) {
                <article
                  #featureItem
                  class="feature-timeline-item"
                  [class.feature-timeline-item-active]="activeFeatureIndex() === index"
                  [attr.data-index]="index"
                  [attr.aria-current]="activeFeatureIndex() === index ? 'step' : null"
                >
                  <div class="feature-marker">
                    <lucide-icon [img]="item.icon" [size]="19" strokeWidth="1.8"></lucide-icon>
                  </div>

                  <div class="feature-content">
                    <span class="feature-step"> 0{{ index + 1 }} </span>

                    <h3 class="mt-2 font-sora text-xl font-semibold text-[var(--cc-text-primary)]">
                      {{ item.title }}
                    </h3>

                    <p
                      class="mt-3 max-w-2xl text-sm leading-7 text-[var(--cc-text-muted)] sm:text-base"
                    >
                      {{ item.description }}
                    </p>

                    <div class="feature-highlight">
                      <span class="feature-highlight-dot"></span>
                      CineCrew para sua crew
                    </div>
                  </div>
                </article>
              }
            </div>
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
            Comece a usar agora mesmo.
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
            É grátis e leva menos de um minuto para criar sua conta.
          </p>

          <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              routerLink="/register"
              class="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FFC250] px-6 text-sm font-bold text-[#111827] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd477]"
            >
              Criar minha conta

              <lucide-icon
                [img]="ArrowRight"
                [size]="17"
                strokeWidth="2.2"
                class="transition-transform duration-300 group-hover:translate-x-1"
              ></lucide-icon>
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

    <app-footer />
  `,
  styles: `
    :host {
      display: block;
    }

    .feature-timeline {
      position: relative;
    }

    .feature-timeline-line {
      position: absolute;
      top: 0.75rem;
      bottom: 0.75rem;
      left: 1.125rem;
      width: 2px;
      overflow: hidden;
      border-radius: 9999px;
      background: var(--cc-border-subtle);
    }

    .feature-timeline-progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 0.75rem;
      border-radius: inherit;
      background: linear-gradient(180deg, #ffc250 0%, #2b4393 52%, #7f8fca 100%);
      box-shadow: 0 0 16px rgba(43, 67, 147, 0.45);
      transition: height 450ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .feature-timeline-item {
      position: relative;
      display: grid;
      grid-template-columns: 2.25rem minmax(0, 1fr);
      column-gap: 1.25rem;
      min-height: 10rem;
      opacity: 0.48;
      transform: translateX(0);
      transition:
        opacity 350ms ease,
        transform 350ms ease;
    }

    .feature-timeline-item-active {
      opacity: 1;
      transform: translateX(0.25rem);
    }

    .feature-marker {
      position: relative;
      z-index: 2;
      display: flex;
      width: 2.25rem;
      height: 2.25rem;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--cc-border-strong);
      border-radius: 9999px;
      color: var(--cc-text-muted);
      background: var(--cc-bg-base);
      box-shadow: 0 0 0 5px var(--cc-bg-base);
      transition:
        border-color 350ms ease,
        color 350ms ease,
        background-color 350ms ease,
        box-shadow 350ms ease,
        transform 350ms ease;
    }

    .feature-timeline-item-active .feature-marker {
      border-color: #ffc250;
      color: #111827;
      background: #ffc250;
      box-shadow:
        0 0 0 5px var(--cc-bg-base),
        0 0 24px rgba(255, 194, 80, 0.35);
      transform: scale(1.08);
    }

    .feature-content {
      min-width: 0;
      padding: 0.15rem 0 1.5rem;
    }

    .feature-step {
      color: var(--cc-text-subtle);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      transition: color 350ms ease;
    }

    .feature-timeline-item-active .feature-step {
      color: #ffc250;
    }

    .feature-highlight {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
      color: var(--cc-text-subtle);
      font-size: 0.6875rem;
      font-weight: 600;
      opacity: 0;
      transform: translateY(0.35rem);
      transition:
        opacity 350ms ease,
        transform 350ms ease,
        color 350ms ease;
    }

    .feature-timeline-item-active .feature-highlight {
      color: var(--cc-text-muted);
      opacity: 1;
      transform: translateY(0);
    }

    .feature-highlight-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 9999px;
      background: #ffc250;
      box-shadow: 0 0 10px rgba(255, 194, 80, 0.5);
    }

    @media (min-width: 768px) {
      .feature-timeline-line {
        left: 1.375rem;
      }

      .feature-timeline-item {
        grid-template-columns: 2.75rem minmax(0, 1fr);
        column-gap: 1.75rem;
        min-height: 11rem;
      }

      .feature-marker {
        width: 2.75rem;
        height: 2.75rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .feature-timeline-progress,
      .feature-timeline-item,
      .feature-marker,
      .feature-step,
      .feature-highlight {
        transition: none;
      }
    }
  `,
})
export class FeaturesOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly seo = inject(SeoService);

  readonly ArrowRight = ArrowRight;
  readonly activeFeatureIndex = signal(0);
  readonly progressPercentage = signal(0);

  @ViewChildren('featureItem')
  private featureItems?: QueryList<ElementRef<HTMLElement>>;

  private observer?: IntersectionObserver;

  readonly allFeatures = [
    {
      icon: Users,
      title: 'Clubes privados',
      description:
        'Grupos exclusivos com convite por link para sua turma. Crie um espaço só de vocês para decidir os próximos rolês sem ruído.',
    },
    {
      icon: CircleDollarSign,
      title: 'Rachadinhas',
      description:
        'Controle de ingressos e pagamentos sem planilha ou Pix perdido no chat. Cada pessoa sabe exatamente sua parte.',
    },
    {
      icon: Trophy,
      title: 'Ranking e gamificação',
      description:
        'Pontos por participação e organização dentro do clube. Transforme cada presença em uma nova conquista.',
    },
    {
      icon: Camera,
      title: 'Feed de memórias',
      description:
        'Fotos e comentários vinculados a cada sessão de cinema para transformar os rolês em um álbum da sua crew.',
    },
    {
      icon: Search,
      title: 'Busca de filmes',
      description:
        'Encontre o próximo filme da sessão direto na plataforma e facilite a decisão da turma.',
    },
    {
      icon: Heart,
      title: 'Lista de desejos',
      description:
        'Guarde filmes que a crew quer assistir em breve e tenha sempre uma ideia para o próximo encontro.',
    },
    {
      icon: Film,
      title: 'Eventos de sessão',
      description:
        'Cada ida ao cinema vira um evento com data, filme e participantes, deixando tudo organizado do início ao fim.',
    },
  ];

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Recursos | CineCrew',
      description:
        'Conheça os recursos do CineCrew: clubes, rachadinhas, ranking, memórias, busca de filmes e lista de desejos.',
    });
  }

  ngAfterViewInit(): void {
    this.initializeFeatureObserver();
    this.updateProgress();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private initializeFeatureObserver(): void {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      !this.featureItems
    ) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top - window.innerHeight / 2) -
              Math.abs(second.boundingClientRect.top - window.innerHeight / 2),
          );

        const visibleEntry = visibleEntries[0];

        if (visibleEntry) {
          const index = Number((visibleEntry.target as HTMLElement).dataset['index']);

          if (!Number.isNaN(index)) {
            this.activeFeatureIndex.set(index);
          }
        }

        this.updateProgress();
      },
      {
        root: null,
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    this.featureItems.forEach((item) => {
      this.observer?.observe(item.nativeElement);
    });
  }

  private updateProgress(): void {
    const total = this.allFeatures.length - 1;
    const current = this.activeFeatureIndex();

    this.progressPercentage.set(total > 0 ? (current / total) * 100 : 0);
  }
}
