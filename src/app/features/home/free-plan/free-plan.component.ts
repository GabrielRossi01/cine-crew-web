import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  LucideAngularModule,
  ShieldCheck,
  Users,
  Gift,
} from 'lucide-angular';

@Component({
  selector: 'app-free-plan',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <section
      class="relative overflow-hidden bg-[var(--cc-bg-base)] px-5 py-12 text-[var(--cc-text-primary)] sm:px-8 sm:py-14 lg:px-12"
      aria-labelledby="free-plan-title"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B4393]/10 blur-[110px]"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-7xl">
        <div
          class="free-plan-card grid gap-7 rounded-2xl p-6 sm:p-7 lg:grid-cols-[0.9fr_1.4fr_auto] lg:items-center lg:gap-10"
        >
          <div>
            <div class="flex items-center gap-2">
              <h2
                id="free-plan-title"
                class="font-sora text-xl font-semibold text-[var(--cc-text-primary)]"
              >
                Grátis
              </h2>
            </div>

            <div class="mt-2 flex items-baseline gap-2">
              <span
                class="font-sora text-4xl font-semibold tracking-[-0.05em] text-[var(--cc-text-primary)]"
              >
                R$ 0
              </span>

              <span class="text-sm text-[var(--cc-text-muted)]"> por mês </span>
            </div>

            <p class="mt-4 max-w-xs text-sm leading-6 text-[var(--cc-text-muted)]">
              Organize seus rolês, pagamentos e memórias sem mensalidade.
            </p>
          </div>

          <div
            class="grid gap-3 text-sm text-[var(--cc-text-secondary)] sm:grid-cols-2 lg:grid-cols-1"
          >
            <div class="flex items-start gap-3">
              <span class="check-icon">
                <lucide-icon [img]="Check" [size]="12" strokeWidth="2.5"></lucide-icon>
              </span>

              <span>Crie clubes privados para sua turma</span>
            </div>

            <div class="flex items-start gap-3">
              <span class="check-icon">
                <lucide-icon [img]="Check" [size]="12" strokeWidth="2.5"></lucide-icon>
              </span>

              <span>Organize sessões e ingressos</span>
            </div>

            <div class="flex items-start gap-3">
              <span class="check-icon">
                <lucide-icon [img]="Check" [size]="12" strokeWidth="2.5"></lucide-icon>
              </span>

              <span>Acompanhe rachadinhas e pagamentos</span>
            </div>

            <div class="flex items-start gap-3">
              <span class="check-icon">
                <lucide-icon [img]="Check" [size]="12" strokeWidth="2.5"></lucide-icon>
              </span>

              <span>Guarde memórias e participe do ranking</span>
            </div>
          </div>

          <div class="flex flex-col items-start gap-3 lg:items-stretch">
            <a
              routerLink="/register"
              class="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#FFC250] px-5 text-sm font-bold text-[#111827] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd477] hover:shadow-[0_0_26px_rgba(255,194,80,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)] lg:min-w-[190px]"
            >
              Começar grátis

              <lucide-icon
                [img]="ArrowRight"
                [size]="16"
                strokeWidth="2.2"
                class="transition-transform duration-300 group-hover:translate-x-1"
              ></lucide-icon>
            </a>

            <span class="text-center text-[11px] text-[var(--cc-text-muted)]">
              Sem cartão de crédito
            </span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .free-plan-card {
      border: 1px solid var(--cc-border-strong);
      background: var(--cc-bg-card);
      box-shadow:
        inset 0 1px 0 var(--cc-border-subtle),
        var(--cc-shadow-card);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .plan-badge {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 9999px;
      padding: 0 0.6rem;
      color: var(--cc-text-muted);
      background: var(--cc-bg-soft);
      font-size: 0.625rem;
      font-weight: 700;
    }

    .check-icon {
      display: flex;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-top: 0.1rem;
      border-radius: 9999px;
      color: #ffc250;
      background: var(--cc-bg-soft);
    }

    @media (max-width: 640px) {
      .free-plan-card {
        padding: 1.25rem;
      }
    }
  `,
})
export class FreePlanComponent {
  readonly ArrowRight = ArrowRight;
  readonly Check = Check;
  readonly CircleDollarSign = CircleDollarSign;
  readonly ShieldCheck = ShieldCheck;
  readonly Users = Users;
}
