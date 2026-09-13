import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Sparkles } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <main
      class="flex min-h-screen items-center justify-center bg-[var(--cc-bg-base)] px-5 text-[var(--cc-text-primary)]"
    >
      <section class="w-full max-w-sm text-center">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2B4393]/40 bg-[#2B4393]/15 text-[var(--cc-icon-primary)]"
        >
          <lucide-icon [img]="Sparkles" [size]="24" strokeWidth="1.8"></lucide-icon>
        </div>

        <h1 class="mt-6 font-sora text-2xl font-semibold">Entrando na sua crew</h1>

        <p class="mt-3 text-sm leading-6 text-[var(--cc-text-muted)]">
          Estamos preparando tudo para você. Só mais um instante.
        </p>

        <div class="mx-auto mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-[var(--cc-bg-soft)]">
          <div class="oauth-progress h-full w-1/2 rounded-full bg-[#FFC250]"></div>
        </div>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .oauth-progress {
      animation: oauth-progress 1.4s ease-in-out infinite;
    }

    @keyframes oauth-progress {
      0% {
        transform: translateX(-100%);
      }

      100% {
        transform: translateX(300%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .oauth-progress {
        animation: none;
        transform: translateX(50%);
      }
    }
  `,
})
export class OAuth2RedirectComponent implements OnInit {
  readonly Sparkles = Sparkles;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const expiresIn = this.route.snapshot.queryParamMap.get('expiresIn');

    if (token && expiresIn) {
      this.authService.handleOAuth2Redirect(token, parseInt(expiresIn, 10));
      this.router.navigate(['/clubs']);
      return;
    }

    this.router.navigate(['/login']);
  }
}
