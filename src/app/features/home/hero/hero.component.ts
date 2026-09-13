import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowRight,
  Camera,
  Check,
  CircleDollarSign,
  Clapperboard,
  Film,
  Heart,
  LucideAngularModule,
  Ticket,
  Trophy,
  Users,
} from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <section
      id="inicio"
      class="relative overflow-hidden bg-[var(--cc-bg-base)] text-[var(--cc-text-primary)]"
      aria-labelledby="hero-title"
    >
      <div
        class="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-16 px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 lg:px-12"
      >
        <!-- Conteúdo -->
        <div class="max-w-xl">
          <div
            class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC250]"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-[#FFC250]"></span>
            Sua crew. Seu cinema.
          </div>

          <h1
            id="hero-title"
            class="mt-5 max-w-xl font-sora text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[var(--cc-text-primary)] sm:text-5xl lg:text-6xl"
          >
            O próximo rolê começa
            <span class="hero-gradient-text"> com a sua crew.</span>
          </h1>

          <p
            class="mt-6 max-w-lg text-sm leading-7 text-[var(--cc-text-muted)] sm:text-base"
          >
            Organize a ida ao cinema, divida os ingressos e guarde as melhores
            memórias em um só lugar.
          </p>

          <div class="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              routerLink="/register"
              class="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#FFC250] px-5 text-sm font-bold text-[#111827] shadow-[0_8px_24px_rgba(255,194,80,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd477] hover:shadow-[0_12px_30px_rgba(255,194,80,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cc-bg-base)]"
            >
              Criar meu clube

              <lucide-icon
                [img]="ArrowRight"
                [size]="17"
                strokeWidth="2.2"
                class="transition-transform duration-300 group-hover:translate-x-1"
              ></lucide-icon>
            </a>

            <span class="text-xs text-[var(--cc-text-muted)]">
              Grátis para começar
            </span>
          </div>

          <div class="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[var(--cc-text-muted)]">
            <span class="inline-flex items-center gap-2">
              <lucide-icon [img]="Check" [size]="14" class="text-[#FFC250]"></lucide-icon>
              Clubes privados
            </span>

            <span class="inline-flex items-center gap-2">
              <lucide-icon [img]="Check" [size]="14" class="text-[#FFC250]"></lucide-icon>
              Pagamentos organizados
            </span>

            <span class="inline-flex items-center gap-2">
              <lucide-icon [img]="Check" [size]="14" class="text-[#FFC250]"></lucide-icon>
              Memórias da sessão
            </span>
          </div>
        </div>

        <!-- Ilustração funcional -->
        <div class="relative mx-auto w-full max-w-[560px]">
          <div class="feature-illustration">
            <div class="illustration-orbit illustration-orbit-one"></div>
            <div class="illustration-orbit illustration-orbit-two"></div>
            <div class="illustration-orbit illustration-orbit-three"></div>

            <!-- Filme central -->
            <div class="movie-node">
              <div class="movie-node-icon">
                <lucide-icon [img]="Clapperboard" [size]="28"></lucide-icon>
              </div>

              <div>
                <span class="movie-node-label">Próxima sessão</span>
                <strong>Sexta da Crew</strong>
                <small>Sábado, 20:30</small>
              </div>
            </div>

            <!-- Participante 1 -->
            <div class="person-node person-node-one">
              <div class="person-avatar person-avatar-blue">A</div>
              <span>Ana confirmou</span>
            </div>

            <!-- Participante 2 -->
            <div class="person-node person-node-two">
              <div class="person-avatar person-avatar-yellow">P</div>
              <span>Pedro entrou</span>
            </div>

            <!-- Participante 3 -->
            <div class="person-node person-node-three">
              <div class="person-avatar person-avatar-purple">J</div>
              <span>Julia postou</span>
            </div>

            <!-- Card de pagamento -->
            <div class="floating-card payment-card">
              <div class="floating-icon floating-icon-yellow">
                <lucide-icon [img]="CircleDollarSign" [size]="17"></lucide-icon>
              </div>

              <div>
                <span>Pagamentos</span>
                <strong>6 de 8 confirmados</strong>
              </div>
            </div>

            <!-- Card de memórias -->
            <div class="floating-card memory-card">
              <div class="floating-icon floating-icon-blue">
                <lucide-icon [img]="Camera" [size]="17"></lucide-icon>
              </div>

              <div>
                <span>Memórias da sessão</span>
                <strong>3 novas fotos</strong>
              </div>
            </div>

            <!-- Card de ranking -->
            <div class="floating-card ranking-card">
              <div class="floating-icon floating-icon-purple">
                <lucide-icon [img]="Trophy" [size]="17"></lucide-icon>
              </div>

              <div>
                <span>Ranking da crew</span>
                <strong>#01 mais ativo</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicadores inferiores -->
      <div
        class="border-t border-[var(--cc-border-subtle)] px-5 py-5 sm:px-8 lg:px-12"
      >
        <div
          class="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3 sm:gap-8"
        >
          <div class="flex items-center gap-3">
            <div class="hero-bottom-icon">
              <lucide-icon [img]="Users" [size]="17"></lucide-icon>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-[var(--cc-text-primary)]">
                Reúna sua turma
              </h2>

              <p class="mt-0.5 text-[11px] text-[var(--cc-text-muted)]">
                Um clube privado para seus amigos.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hero-bottom-icon hero-bottom-icon-yellow">
              <lucide-icon [img]="Ticket" [size]="17"></lucide-icon>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-[var(--cc-text-primary)]">
                Planeje o rolê
              </h2>

              <p class="mt-0.5 text-[11px] text-[var(--cc-text-muted)]">
                Sessões, ingressos e pagamentos.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hero-bottom-icon hero-bottom-icon-purple">
              <lucide-icon [img]="Heart" [size]="17"></lucide-icon>
            </div>

            <div>
              <h2 class="text-xs font-semibold text-[var(--cc-text-primary)]">
                Guarde o momento
              </h2>

              <p class="mt-0.5 text-[11px] text-[var(--cc-text-muted)]">
                Fotos e memórias de cada sessão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero-gradient-text {
      background: linear-gradient(
        105deg,
        var(--cc-text-primary) 8%,
        #9fb1ff 48%,
        #ffc250 94%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .feature-illustration {
      position: relative;
      min-height: 490px;
      isolation: isolate;
    }

    .feature-illustration::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18rem;
      height: 18rem;
      border-radius: 9999px;
      background: rgba(43, 67, 147, 0.12);
      content: '';
      filter: blur(70px);
      transform: translate(-50%, -50%);
      z-index: -2;
    }

    .illustration-orbit {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 9999px;
      transform: translate(-50%, -50%) rotate(-18deg);
    }

    .illustration-orbit-one {
      width: 22rem;
      height: 13rem;
      border-color: rgba(255, 194, 80, 0.18);
    }

    .illustration-orbit-two {
      width: 29rem;
      height: 17rem;
      border-color: rgba(43, 67, 147, 0.3);
      transform: translate(-50%, -50%) rotate(28deg);
    }

    .illustration-orbit-three {
      width: 34rem;
      height: 21rem;
      border-color: rgba(159, 177, 255, 0.12);
      transform: translate(-50%, -50%) rotate(-35deg);
    }

    .movie-node {
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      width: 230px;
      padding: 1rem;
      border: 1px solid var(--cc-border-strong);
      border-radius: 1rem;
      background: var(--cc-bg-card);
      box-shadow: var(--cc-shadow-card);
      transform: translate(-50%, -50%);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .movie-node-icon {
      display: flex;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      color: #ffffff;
      background: #2b4393;
    }

    .movie-node-label,
    .floating-card span,
    .person-node span {
      display: block;
      color: var(--cc-text-muted);
      font-size: 0.625rem;
    }

    .movie-node strong,
    .floating-card strong {
      display: block;
      margin-top: 0.2rem;
      color: var(--cc-text-primary);
      font-size: 0.72rem;
      font-weight: 700;
    }

    .movie-node small {
      display: block;
      margin-top: 0.25rem;
      color: var(--cc-text-muted);
      font-size: 0.625rem;
    }

    .floating-card {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      min-width: 165px;
      padding: 0.7rem;
      border: 1px solid var(--cc-border-default);
      border-radius: 0.85rem;
      background: var(--cc-bg-elevated);
      box-shadow: var(--cc-shadow-section);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .floating-icon {
      display: flex;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 0.6rem;
    }

    .floating-icon-yellow {
      color: #ffc250;
      background: rgba(255, 194, 80, 0.12);
    }

    .floating-icon-blue {
      color: #9fb1ff;
      background: rgba(43, 67, 147, 0.18);
    }

    .floating-icon-purple {
      color: #c4b5fd;
      background: rgba(139, 92, 246, 0.14);
    }

    .payment-card {
      top: 8%;
      right: 3%;
    }

    .memory-card {
      right: 2%;
      bottom: 11%;
    }

    .ranking-card {
      bottom: 3%;
      left: 5%;
    }

    .person-node {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.6rem 0.35rem 0.35rem;
      border: 1px solid var(--cc-border-subtle);
      border-radius: 9999px;
      background: var(--cc-bg-elevated);
      box-shadow: var(--cc-shadow-section);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .person-avatar {
      display: flex;
      width: 30px;
      height: 30px;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .person-avatar-blue {
      background: #2b4393;
    }

    .person-avatar-yellow {
      color: #111827;
      background: #ffc250;
    }

    .person-avatar-purple {
      background: #7651bd;
    }

    .person-node-one {
      top: 15%;
      left: 5%;
    }

    .person-node-two {
      top: 41%;
      right: -1%;
    }

    .person-node-three {
      bottom: 16%;
      left: 20%;
    }

    .hero-bottom-icon {
      display: flex;
      width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(43, 67, 147, 0.4);
      border-radius: 0.65rem;
      color: var(--cc-icon-primary);
      background: rgba(43, 67, 147, 0.12);
    }

    .hero-bottom-icon-yellow {
      border-color: rgba(255, 194, 80, 0.3);
      color: #ffc250;
      background: rgba(255, 194, 80, 0.1);
    }

    .hero-bottom-icon-purple {
      border-color: rgba(139, 92, 246, 0.3);
      color: #c4b5fd;
      background: rgba(139, 92, 246, 0.1);
    }

    @media (max-width: 767px) {
      .feature-illustration {
        min-height: 390px;
        transform: scale(0.88);
        transform-origin: center top;
      }

      .illustration-orbit-one {
        width: 18rem;
        height: 11rem;
      }

      .illustration-orbit-two {
        width: 23rem;
        height: 14rem;
      }

      .illustration-orbit-three {
        width: 28rem;
        height: 17rem;
      }

      .payment-card {
        right: -2%;
      }

      .memory-card {
        right: -4%;
      }

      .ranking-card {
        left: 0;
      }

      .person-node-two {
        right: -8%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .feature-illustration *,
      .hero-gradient-text {
        transition: none;
      }
    }
  `,
})
export class HeroComponent {
  readonly ArrowRight = ArrowRight;
  readonly Camera = Camera;
  readonly Check = Check;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Clapperboard = Clapperboard;
  readonly Film = Film;
  readonly Heart = Heart;
  readonly Ticket = Ticket;
  readonly Trophy = Trophy;
  readonly Users = Users;
}
