import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#2B4393]/20 flex flex-col items-center justify-center p-4 text-center">

      <div class="text-[10rem] md:text-[12rem] leading-none font-black font-sora bg-clip-text text-transparent bg-gradient-to-r from-[#2B4393] to-[#FFC250] mb-4">
        404
      </div>

      <div class="text-6xl mb-8">🎬</div>

      <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 font-sora max-w-2xl">
        Ops, parece que você se perdeu no cinema!
      </h1>

      <p class="text-neutral-400 text-lg mb-10 max-w-xl">
        A página que você procura não existe, foi movida ou a sessão já terminou.
      </p>

      <a routerLink="/"
         class="bg-[#FFC250] text-[#0f0f1a] px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,194,80,0.3)] mb-12 min-h-[44px] inline-flex items-center justify-center">
        Voltar para casa
      </a>

      <div class="flex gap-6 text-sm text-neutral-500">
        <a routerLink="/clubs" class="hover:text-[#FFC250] transition-colors p-2">Meus Clubes</a>
        <a routerLink="/watchlist" class="hover:text-[#FFC250] transition-colors p-2">Lista de Desejos</a>
      </div>

    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class NotFoundComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Página Não Encontrada',
      description: 'A página que você procura não existe.',
      noIndex: true
    });
  }
}
