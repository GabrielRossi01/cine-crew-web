import { Component } from '@angular/core';
import { Camera, CircleDollarSign, LucideAngularModule, Trophy, Users } from 'lucide-angular';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section
      id="sobre"
      class="relative overflow-hidden bg-[var(--cc-bg-base)] px-5 py-20 text-[var(--cc-text-primary)] sm:px-8 sm:py-24 lg:px-12"
      aria-labelledby="features-title"
    >
      <div
        class="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2B4393]/10 blur-[110px]"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-7xl">
        <header class="mx-auto max-w-xl text-center">
          <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
            Feito para a sua crew
          </span>

          <h2
            id="features-title"
            class="mt-3 font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
          >
            Menos mensagens. Mais cinema.
          </h2>

          <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
            Tudo para tirar o próximo rolê do papel, sem perder tempo organizando.
          </p>
        </header>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (feature of features; track feature.title) {
            <article
              class="group relative overflow-hidden rounded-2xl border border-[var(--cc-border-default)] bg-[var(--cc-bg-elevated)] p-5 shadow-[var(--cc-shadow-section)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2B4393]/70 hover:bg-[var(--cc-bg-soft)]"
            >
              <div
                class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2B4393]/10 blur-2xl transition-colors duration-300 group-hover:bg-[#FFC250]/10"
                aria-hidden="true"
              ></div>

              <div
                class="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B4393]/40 bg-[#2B4393]/15 text-[var(--cc-icon-primary)] transition-all duration-300 group-hover:border-[#FFC250]/40 group-hover:bg-[#FFC250]/10 group-hover:text-[#FFC250]"
              >
                <lucide-icon [img]="feature.icon" [size]="19" strokeWidth="1.8"></lucide-icon>
              </div>

              <h3
                class="relative mt-5 font-sora text-base font-semibold text-[var(--cc-text-primary)]"
              >
                {{ feature.title }}
              </h3>

              <p class="relative mt-2 text-sm leading-6 text-[var(--cc-text-muted)]">
                {{ feature.description }}
              </p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class FeaturesComponent {
  readonly features = [
    {
      icon: Users,
      title: 'Clubes privados',
      description: 'Reúna sua turma e planeje sessões sem ruído.',
    },
    {
      icon: CircleDollarSign,
      title: 'Rachadinhas',
      description: 'Acompanhe ingressos e quem já acertou a parte.',
    },
    {
      icon: Trophy,
      title: 'Ranking',
      description: 'Transforme cada presença em mais diversão.',
    },
    {
      icon: Camera,
      title: 'Memórias',
      description: 'Guarde fotos e momentos de cada sessão.',
    },
  ];
}
