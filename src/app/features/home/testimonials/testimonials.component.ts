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
            Mais organização no grupo. Mais momentos para lembrar.
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
                    <div class="testimonial-avatar">
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
      border: 1px solid var(--testimonial-glass-border);
      background: var(--testimonial-glass-surface);
      box-shadow:
        inset 0 1px 0 var(--testimonial-glass-highlight),
        0 18px 42px var(--testimonial-glass-shadow);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transform: translateZ(0);
      transition:
        border-color 250ms ease,
        background 250ms ease,
        box-shadow 250ms ease;
    }

    .liquid-card:hover {
      border-color: var(--testimonial-glass-hover-border);
      background: var(--testimonial-glass-hover-surface);
      box-shadow:
        inset 0 1px 0 var(--testimonial-glass-hover-highlight),
        0 24px 52px var(--testimonial-glass-hover-shadow);
    }

    .testimonial-avatar {
      display: flex;
      width: 2.5rem;
      height: 2.5rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--testimonial-avatar-border);
      border-radius: 9999px;
      color: var(--testimonial-avatar-text);
      background: var(--testimonial-avatar-surface);
      box-shadow: inset 0 1px 0 var(--testimonial-glass-highlight);
      font-size: 0.875rem;
      font-weight: 700;
    }

    .carousel-control {
      display: inline-flex;
      width: 38px;
      height: 38px;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 9999px;
      color: var(--cc-text-secondary);
      background: var(--cc-bg-elevated);
      box-shadow: 0 8px 18px var(--testimonial-control-shadow);
      transition:
        background-color 250ms ease,
        border-color 250ms ease,
        color 250ms ease,
        transform 250ms ease;
    }

    .carousel-control:hover {
      border-color: var(--cc-border-strong);
      color: var(--cc-text-primary);
      background: var(--cc-bg-soft);
      transform: translateY(-1px);
    }

    :host-context(.dark) {
      --testimonial-glass-border: rgba(255, 255, 255, 0.14);
      --testimonial-glass-surface: rgba(255, 255, 255, 0.035);
      --testimonial-glass-highlight: rgba(255, 255, 255, 0.14);
      --testimonial-glass-shadow: rgba(0, 0, 0, 0.28);
      --testimonial-glass-hover-border: rgba(255, 194, 80, 0.46);
      --testimonial-glass-hover-surface: rgba(255, 255, 255, 0.055);
      --testimonial-glass-hover-highlight: rgba(255, 255, 255, 0.2);
      --testimonial-glass-hover-shadow: rgba(0, 0, 0, 0.38);
      --testimonial-avatar-border: rgba(255, 255, 255, 0.16);
      --testimonial-avatar-surface: rgba(255, 255, 255, 0.06);
      --testimonial-avatar-text: var(--cc-text-primary);
      --testimonial-control-shadow: rgba(0, 0, 0, 0.2);
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --testimonial-glass-border: rgba(20, 31, 58, 0.16);
      --testimonial-glass-surface: rgba(255, 255, 255, 0.48);
      --testimonial-glass-highlight: rgba(255, 255, 255, 0.86);
      --testimonial-glass-shadow: rgba(34, 48, 78, 0.14);
      --testimonial-glass-hover-border: rgba(43, 67, 147, 0.4);
      --testimonial-glass-hover-surface: rgba(255, 255, 255, 0.64);
      --testimonial-glass-hover-highlight: rgba(255, 255, 255, 0.96);
      --testimonial-glass-hover-shadow: rgba(34, 48, 78, 0.2);
      --testimonial-avatar-border: rgba(43, 67, 147, 0.2);
      --testimonial-avatar-surface: rgba(43, 67, 147, 0.08);
      --testimonial-avatar-text: #2b4393;
      --testimonial-control-shadow: rgba(34, 48, 78, 0.12);
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
      .liquid-card,
      .carousel-control {
        transition: none;
      }
    }

    @supports not (backdrop-filter: blur(1px)) {
      .liquid-card {
        background: var(--testimonial-fallback-surface);
      }
    }

    :host-context(.dark) {
      --testimonial-fallback-surface: rgba(255, 255, 255, 0.08);
    }

    :host-context(.light),
    :host-context([data-theme='light']) {
      --testimonial-fallback-surface: rgba(255, 255, 255, 0.78);
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
      role: 'Membro da crew',
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
      role: 'Membro da crew',
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
