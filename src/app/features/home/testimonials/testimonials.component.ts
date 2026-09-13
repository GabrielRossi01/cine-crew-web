import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { ArrowLeft, ArrowRight, LucideAngularModule, Quote, Star } from 'lucide-angular';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section
      id="depoimentos"
      class="relative scroll-mt-24 overflow-hidden bg-[var(--cc-bg-base)] px-5 py-20 text-[var(--cc-text-primary)] sm:px-8 sm:py-24 lg:px-12"
      aria-labelledby="testimonials-title"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[#2B4393]/10 blur-[130px]"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--cc-border-subtle)] to-transparent"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-7xl">
        <header class="mx-auto max-w-xl text-center">
          <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
            Histórias da crew
          </span>

          <h2
            id="testimonials-title"
            class="mt-3 font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
          >
            Quem vive o rolê, recomenda.
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
            Menos organização no grupo. Mais momentos para lembrar.
          </p>
        </header>

        <div
          #carouselViewport
          class="testimonial-viewport relative mx-auto mt-12 max-w-[1100px]"
          (mouseenter)="pauseCarousel()"
          (mouseleave)="resumeCarousel()"
          (touchstart)="pauseCarousel()"
          (touchend)="resumeCarousel()"
        >
          <div class="testimonial-track" [style.transform]="trackTransform()">
            @for (testimonial of testimonials; track testimonial.name; let index = $index) {
              <article
                class="testimonial-slide"
                [class.testimonial-slide-active]="currentIndex() === index"
                [attr.aria-hidden]="currentIndex() !== index"
              >
                <div
                  class="liquid-card relative flex h-full min-h-[290px] flex-col overflow-hidden rounded-2xl p-7 sm:min-h-[320px] sm:p-9"
                >
                  <div class="liquid-glow liquid-glow-blue" aria-hidden="true"></div>
                  <div class="liquid-glow liquid-glow-green" aria-hidden="true"></div>

                  <div class="relative z-10 flex items-start justify-between gap-6">
                    <lucide-icon
                      [img]="Quote"
                      [size]="34"
                      strokeWidth="1.4"
                      class="text-[var(--cc-text-subtle)]"
                      aria-hidden="true"
                    ></lucide-icon>

                    <div class="flex gap-0.5 text-[#FFC250]" aria-label="Avaliação máxima">
                      @for (star of stars; track star) {
                        <lucide-icon
                          [img]="Star"
                          [size]="12"
                          fill="currentColor"
                          strokeWidth="1.5"
                        ></lucide-icon>
                      }
                    </div>
                  </div>

                  <blockquote
                    class="relative z-10 mt-7 max-w-3xl font-sora text-base font-semibold leading-7 text-[var(--cc-text-primary)] sm:text-lg sm:leading-8"
                  >
                    “{{ testimonial.text }}”
                  </blockquote>

                  <div class="relative z-10 mt-auto flex items-center gap-3 pt-8">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--cc-border-strong)] bg-[var(--cc-bg-elevated)] text-sm font-bold text-[var(--cc-text-primary)] shadow-lg backdrop-blur-xl"
                    >
                      {{ testimonial.initial }}
                    </div>

                    <div>
                      <h3 class="text-sm font-semibold text-[var(--cc-text-primary)]">
                        {{ testimonial.name }}
                      </h3>

                      <p class="mt-0.5 text-xs text-[var(--cc-text-muted)]">
                        {{ testimonial.role }}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>

          <div
            class="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[var(--cc-bg-base)] to-transparent sm:w-36"
            aria-hidden="true"
          ></div>

          <div
            class="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[var(--cc-bg-base)] to-transparent sm:w-36"
            aria-hidden="true"
          ></div>
        </div>

        <div class="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            class="carousel-control"
            aria-label="Depoimento anterior"
            (click)="previous()"
          >
            <lucide-icon [img]="ArrowLeft" [size]="17" strokeWidth="1.8"></lucide-icon>
          </button>

          <div class="flex items-center gap-2 px-2">
            @for (testimonial of testimonials; track testimonial.name; let index = $index) {
              <button
                type="button"
                class="h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250]"
                [class.w-6]="currentIndex() === index"
                [class.w-1.5]="currentIndex() !== index"
                [class.bg-[#FFC250]]="currentIndex() === index"
                [class.bg-[var(--cc-border-strong)]]="currentIndex() !== index"
                [attr.aria-label]="'Exibir depoimento de ' + testimonial.name"
                [attr.aria-current]="currentIndex() === index ? 'true' : null"
                (click)="goTo(index)"
              ></button>
            }
          </div>

          <button
            type="button"
            class="carousel-control"
            aria-label="Próximo depoimento"
            (click)="next()"
          >
            <lucide-icon [img]="ArrowRight" [size]="17" strokeWidth="1.8"></lucide-icon>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .testimonial-viewport {
      overflow: hidden;
    }

    .testimonial-track {
      display: flex;
      align-items: stretch;
      gap: 16px;
      width: max-content;
      transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }

    .testimonial-slide {
      flex: 0 0 calc(100vw - 40px);
      max-width: calc(100vw - 40px);
      opacity: 0.35;
      transform: scale(0.94);
      transition:
        opacity 500ms ease,
        transform 500ms ease;
    }

    .testimonial-slide-active {
      opacity: 1;
      transform: scale(1);
    }

    .liquid-card {
      isolation: isolate;
      border: 1px solid var(--cc-border-default);
      background: var(--cc-bg-card);
      box-shadow:
        inset 0 1px 0 var(--cc-border-subtle),
        inset 0 -1px 0 rgba(255, 255, 255, 0.04),
        var(--cc-shadow-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .liquid-card::before {
      position: absolute;
      inset: 1px;
      z-index: -1;
      border-radius: inherit;
      background: var(--cc-bg-soft);
      content: '';
      pointer-events: none;
    }

    .liquid-card::after {
      position: absolute;
      inset: 0;
      z-index: -2;
      border-radius: inherit;
      background: transparent;
      content: '';
      pointer-events: none;
    }

    .liquid-glow {
      position: absolute;
      z-index: -1;
      width: 11rem;
      height: 11rem;
      border-radius: 9999px;
      filter: blur(42px);
      opacity: 0.2;
      pointer-events: none;
    }

    .liquid-glow-blue {
      top: -7rem;
      right: -4rem;
      background: rgba(72, 107, 224, 0.4);
    }

    .liquid-glow-green {
      bottom: -8rem;
      left: -5rem;
      background: rgba(80, 190, 156, 0.25);
    }

    .carousel-control {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 9999px;
      color: var(--cc-text-secondary);
      background: var(--cc-bg-elevated);
      transition:
        background-color 250ms ease,
        border-color 250ms ease,
        color 250ms ease,
        transform 250ms ease;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .carousel-control:hover {
      border-color: var(--cc-border-strong);
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
      transform: translateY(-1px);
    }

    @media (min-width: 768px) {
      .testimonial-slide {
        flex-basis: 620px;
        max-width: 620px;
      }
    }

    @media (min-width: 1024px) {
      .testimonial-slide {
        flex-basis: 620px;
        max-width: 620px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .testimonial-track,
      .testimonial-slide,
      .carousel-control {
        transition: none;
      }
    }
  `,
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly Quote = Quote;
  readonly Star = Star;

  readonly stars = [1, 2, 3, 4, 5];

  readonly testimonials = [
    {
      initial: 'A',
      name: 'Ana L.',
      role: 'Organizadora da crew',
      text: 'Agora a turma decide o filme sem perder horas no grupo. Ficou muito mais fácil combinar tudo.',
    },
    {
      initial: 'P',
      name: 'Pedro H.',
      role: 'Membro da crew',
      text: 'Finalmente consigo acompanhar os ingressos e saber quem já acertou a parte da rachadinha.',
    },
    {
      initial: 'J',
      name: 'Julia S.',
      role: 'Memória da crew',
      text: 'As fotos de cada sessão viraram o álbum oficial das nossas idas ao cinema.',
    },
  ];

  readonly currentIndex = signal(0);
  readonly trackTransform = signal('translateX(0px)');

  @ViewChild('carouselViewport')
  private carouselViewport?: ElementRef<HTMLElement>;

  private intervalId?: ReturnType<typeof setInterval>;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateTrackPosition();
    this.startCarousel();

    if (typeof ResizeObserver !== 'undefined' && this.carouselViewport) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateTrackPosition();
      });

      this.resizeObserver.observe(this.carouselViewport.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.stopCarousel();
    this.resizeObserver?.disconnect();
  }

  next(): void {
    this.currentIndex.update((current) => (current + 1) % this.testimonials.length);

    this.updateTrackPosition();
    this.restartCarousel();
  }

  previous(): void {
    this.currentIndex.update(
      (current) => (current - 1 + this.testimonials.length) % this.testimonials.length,
    );

    this.updateTrackPosition();
    this.restartCarousel();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.updateTrackPosition();
    this.restartCarousel();
  }

  pauseCarousel(): void {
    this.stopCarousel();
  }

  resumeCarousel(): void {
    this.startCarousel();
  }

  private updateTrackPosition(): void {
    if (!this.carouselViewport) {
      return;
    }

    const viewportWidth = this.carouselViewport.nativeElement.clientWidth;
    const slideWidth = this.getSlideWidth(viewportWidth);
    const gap = 16;

    const offset = (viewportWidth - slideWidth) / 2;
    const translateX = offset - this.currentIndex() * (slideWidth + gap);

    this.trackTransform.set(`translateX(${translateX}px)`);
  }

  private getSlideWidth(viewportWidth: number): number {
    if (viewportWidth < 768) {
      return Math.max(viewportWidth - 40, 280);
    }

    return Math.min(620, viewportWidth * 0.62);
  }

  private startCarousel(): void {
    if (typeof window === 'undefined' || this.intervalId) {
      return;
    }

    this.intervalId = window.setInterval(() => {
      this.currentIndex.update((current) => (current + 1) % this.testimonials.length);

      this.updateTrackPosition();
    }, 5500);
  }

  private restartCarousel(): void {
    this.stopCarousel();
    this.startCarousel();
  }

  private stopCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
