import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  Camera,
  CircleDollarSign,
  Clapperboard,
  Link2,
  LucideAngularModule,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-angular';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-clubs-overview',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />

    <main class="bg-[var(--cc-bg-base)] text-[var(--cc-text-primary)]">
      <section class="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <div
          class="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#2B4393]/20 blur-[130px]"
          aria-hidden="true"
        ></div>

        <div
          class="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#FFC250]/[0.05] blur-[150px]"
          aria-hidden="true"
        ></div>

        <div class="relative mx-auto max-w-3xl text-center">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-[#FFC250]/25 bg-[#FFC250]/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFC250]"
          >
            <lucide-icon [img]="Users" [size]="13" strokeWidth="1.8"></lucide-icon>
            Recurso CineCrew
          </span>

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
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]">
              Como funciona
            </span>

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
            <div
              class="absolute -inset-4 rounded-[1.75rem] bg-[#2B4393]/20 blur-3xl"
              aria-hidden="true"
            ></div>

            <div
              class="relative overflow-hidden rounded-[1.75rem] border border-[var(--cc-border-strong)] bg-[var(--cc-bg-elevated)] p-4 shadow-[var(--cc-shadow-card)] backdrop-blur-2xl"
            >
              <div class="flex items-center gap-2 border-b border-[var(--cc-border-subtle)] pb-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2B4393]">
                  <lucide-icon [img]="Clapperboard" [size]="17"></lucide-icon>
                </div>

                <div>
                  <p class="text-sm font-semibold text-[var(--cc-text-primary)]">Sexta da Crew</p>

                  <p class="text-[11px] text-[var(--cc-text-muted)]">8 participantes</p>
                </div>
              </div>

              <div
                class="mt-4 flex items-center justify-between rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-bg-base)] p-3"
              >
                <span class="text-xs text-[var(--cc-text-muted)]"> Convite ativo </span>

                <span
                  class="rounded-full bg-[#FFC250]/10 px-2.5 py-1 text-[10px] font-bold uppercase text-[#FFC250]"
                >
                  cinecrew.app/j/8fk2
                </span>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2.5">
                <div
                  class="rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-bg-soft)] p-3"
                >
                  <div class="flex items-center gap-1.5 text-[#FFC250]">
                    <lucide-icon [img]="CircleDollarSign" [size]="15"></lucide-icon>
                    <span class="text-[11px] font-semibold">Pagamentos</span>
                  </div>

                  <p class="mt-2 text-base font-bold text-[var(--cc-text-primary)]">6 de 8</p>
                </div>

                <div
                  class="rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-bg-soft)] p-3"
                >
                  <div class="flex items-center gap-1.5 text-[var(--cc-icon-primary)]">
                    <lucide-icon [img]="Trophy" [size]="15"></lucide-icon>
                    <span class="text-[11px] font-semibold">Ranking</span>
                  </div>

                  <p class="mt-2 text-base font-bold text-[var(--cc-text-primary)]">#01</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-t border-[var(--cc-border-subtle)] px-5 py-20 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-7xl">
          <header class="mx-auto max-w-xl text-center">
            <h2
              class="font-sora text-2xl font-semibold tracking-[-0.03em] text-[var(--cc-text-primary)] sm:text-3xl"
            >
              O que você organiza dentro do clube.
            </h2>
          </header>

          <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @for (item of clubFeatures; track item.title) {
              <article
                class="rounded-2xl border border-[var(--cc-border-default)] bg-[var(--cc-bg-elevated)] p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2B4393]/70"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2B4393]/40 bg-[#2B4393]/15 text-[var(--cc-icon-primary)]"
                >
                  <lucide-icon [img]="item.icon" [size]="19" strokeWidth="1.8"></lucide-icon>
                </div>

                <h3 class="mt-5 font-sora text-base font-semibold text-[var(--cc-text-primary)]">
                  {{ item.title }}
                </h3>

                <p class="mt-2 text-sm leading-6 text-[var(--cc-text-muted)]">
                  {{ item.description }}
                </p>
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

    <app-footer />
  `,
})
export class ClubsOverviewComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly ArrowRight = ArrowRight;
  readonly Camera = Camera;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Clapperboard = Clapperboard;
  readonly Link2 = Link2;
  readonly ShieldCheck = ShieldCheck;
  readonly Trophy = Trophy;
  readonly Users = Users;

  readonly clubFeatures = [
    {
      icon: this.Link2,
      title: 'Convite por link',
      description: 'Compartilhe um link e sua turma entra em segundos.',
    },
    {
      icon: this.CircleDollarSign,
      title: 'Rachadinha',
      description: 'Registre o valor dos ingressos e quem já pagou.',
    },
    {
      icon: this.Trophy,
      title: 'Ranking interno',
      description: 'Veja quem mais participa e organiza os rolês.',
    },
    {
      icon: this.Camera,
      title: 'Memórias do clube',
      description: 'Fotos e comentários vinculados a cada sessão.',
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
