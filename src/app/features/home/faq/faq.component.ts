import { Component } from '@angular/core';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section
      id="faq"
      class="relative scroll-mt-24 overflow-hidden bg-[var(--cc-bg-base)] px-5 py-20 text-[var(--cc-text-primary)] sm:px-8 sm:py-24 lg:px-12"
      aria-labelledby="faq-title"
    >
      <div
        class="pointer-events-none absolute -left-40 bottom-0 h-64 w-64 rounded-full bg-[#FFC250]/[0.04] blur-[120px]"
        aria-hidden="true"
      ></div>

      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--cc-border-subtle)] to-transparent"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-3xl">
        <header class="mx-auto max-w-2xl text-center">
          <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
            Dúvidas frequentes
          </span>

          <h2
            id="faq-title"
            class="mt-3 font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
          >
            Tudo sobre o CineCrew.
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
            Respondemos as principais dúvidas para você começar a organizar o próximo rolê.
          </p>
        </header>

        <div class="mt-12">
          @for (item of faqItems; track item.question; let index = $index) {
            <article class="faq-item">
              <button
                type="button"
                class="faq-question"
                [attr.aria-expanded]="openIndex === index"
                [attr.aria-controls]="'faq-answer-' + index"
                (click)="toggle(index)"
              >
                <span
                  class="faq-symbol"
                  [class.faq-symbol-open]="openIndex === index"
                  aria-hidden="true"
                >
                  {{ openIndex === index ? '−' : '+' }}
                </span>

                <span class="flex-1 text-left text-[var(--cc-text-primary)]">
                  {{ item.question }}
                </span>

                <lucide-icon
                  [img]="ChevronDown"
                  [size]="17"
                  strokeWidth="1.8"
                  class="faq-chevron"
                  [class.faq-chevron-open]="openIndex === index"
                  aria-hidden="true"
                ></lucide-icon>
              </button>

              <div
                [id]="'faq-answer-' + index"
                class="faq-answer-wrapper"
                [class.faq-answer-wrapper-open]="openIndex === index"
                [attr.aria-hidden]="openIndex !== index"
              >
                <div class="faq-answer">
                  {{ item.answer }}
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .faq-item {
      border-bottom: 1px solid var(--cc-border-subtle);
    }

    .faq-item:first-child {
      border-top: 1px solid var(--cc-border-subtle);
    }

    .faq-question {
      display: flex;
      width: 100%;
      align-items: center;
      gap: 0.75rem;
      min-height: 76px;
      color: var(--cc-text-primary);
      font-size: 0.95rem;
      font-weight: 600;
      text-align: left;
      transition:
        color 200ms ease,
        padding-left 200ms ease;
    }

    .faq-question:hover {
      color: #ffc250;
      padding-left: 0.25rem;
    }

    .faq-symbol {
      display: inline-flex;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      color: #2b4393;
      font-size: 1.3rem;
      font-weight: 400;
      line-height: 1;
      transition:
        color 200ms ease,
        transform 200ms ease;
    }

    .faq-symbol-open {
      color: #ffc250;
      transform: rotate(180deg);
    }

    .faq-chevron {
      flex-shrink: 0;
      color: var(--cc-text-muted);
      transition:
        color 200ms ease,
        transform 300ms ease;
    }

    .faq-question:hover .faq-chevron {
      color: #ffc250;
    }

    .faq-chevron-open {
      color: #ffc250;
      transform: rotate(180deg);
    }

    .faq-answer-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 350ms ease,
        opacity 250ms ease;
    }

    .faq-answer-wrapper-open {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .faq-answer {
      min-height: 0;
      overflow: hidden;
      max-width: 46rem;
      padding: 0 2.2rem 0 2.75rem;
      color: var(--cc-text-muted);
      font-size: 0.875rem;
      line-height: 1.75rem;
      transition: padding-bottom 350ms ease;
    }

    .faq-answer-wrapper-open .faq-answer {
      padding-bottom: 1.25rem;
    }

    @media (max-width: 640px) {
      .faq-question {
        min-height: 70px;
        font-size: 0.875rem;
      }

      .faq-answer {
        padding-right: 0;
        padding-left: 2.2rem;
        font-size: 0.8125rem;
        line-height: 1.6rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .faq-question,
      .faq-symbol,
      .faq-chevron,
      .faq-answer-wrapper,
      .faq-answer {
        transition: none;
      }
    }
  `,
})
export class FaqComponent {
  readonly ChevronDown = ChevronDown;

  openIndex: number | null = 0;

  readonly faqItems = [
    {
      question: 'O que é o CineCrew?',
      answer:
        'O CineCrew é uma plataforma para organizar idas ao cinema com amigos. Você pode criar um clube privado, combinar sessões, acompanhar ingressos e pagamentos, participar de rankings e guardar fotos e memórias de cada rolê.',
    },
    {
      question: 'O CineCrew é gratuito?',
      answer:
        'Sim. O CineCrew foi pensado para ser totalmente gratuito para os usuários. Você pode criar sua conta, participar de clubes e organizar suas sessões sem mensalidade.',
    },
    {
      question: 'Como posso criar um clube?',
      answer:
        'Basta criar sua conta e acessar a opção “Criar clube”. Depois, informe o nome da sua crew e compartilhe o link de convite com seus amigos.',
    },
    {
      question: 'Como funcionam as rachadinhas?',
      answer:
        'O organizador registra o valor dos ingressos ou de outros custos da sessão. Cada participante visualiza sua parte e o organizador consegue marcar quem já enviou o pagamento.',
    },
    {
      question: 'Preciso comprar os ingressos pelo CineCrew?',
      answer:
        'Não. O CineCrew ajuda a organizar e acompanhar os ingressos, mas a compra pode continuar sendo feita pelo canal de sua preferência. A plataforma centraliza as informações para evitar confusão no grupo.',
    },
    {
      question: 'O que são o ranking e a pontuação?',
      answer:
        'O ranking estimula a participação da crew. Os membros podem ganhar pontos ao participar de sessões, organizar rolês e interagir com as memórias do grupo.',
    },
    {
      question: 'Posso guardar fotos e memórias das sessões?',
      answer:
        'Sim. Cada sessão pode receber um post de memória com fotos, comentários e avaliações. Assim, o clube se transforma em um histórico dos momentos vividos pela turma.',
    },
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
