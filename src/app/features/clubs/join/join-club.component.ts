import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ClubService } from '../../../core/services/club.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-join-club',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] flex flex-col items-center justify-center p-4"
    >
      <div
        class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <span class="text-6xl mb-6 block" aria-hidden="true">🎟️</span>
        <h1 class="text-3xl font-bold font-sora text-white mb-2">Entrando no Clube</h1>

        @if (loading()) {
          <p class="text-neutral-400 mb-8">Validando seu convite e preparando tudo...</p>
          <div class="flex justify-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC250]"
              role="status"
              aria-label="Validando convite..."
            ></div>
          </div>
        } @else if (error()) {
          <p class="text-red-400 mb-8">{{ errorMsg() }}</p>
          <button
            (click)="router.navigate(['/clubs'])"
            aria-label="Voltar para meus clubes"
            class="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all min-h-[44px]"
          >
            Voltar para meus clubes
          </button>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class JoinClubComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly clubService = inject(ClubService);
  private readonly toastService = inject(ToastService);

  loading = signal(true);
  error = signal(false);
  errorMsg = signal('');

  ngOnInit(): void {
    const inviteCode = this.route.snapshot.paramMap.get('inviteCode');
    if (inviteCode) {
      this.join(inviteCode);
    } else {
      this.error.set(true);
      this.errorMsg.set('Código de convite não encontrado.');
      this.loading.set(false);
    }
  }

  join(code: string): void {
    this.clubService.joinClub(code).subscribe({
      next: () => {
        this.toastService.success('Você entrou no clube com sucesso!');
        this.router.navigate(['/clubs']);
      },
      error: (err: any) => {
        this.error.set(true);
        const message =
          err?.error?.message ||
          err?.message ||
          'Erro ao entrar no clube. O convite pode ter expirado ou ser inválido.';
        this.errorMsg.set(message);
        this.loading.set(false);
        this.toastService.error(message);
      },
    });
  }
}
