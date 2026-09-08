import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <section class="py-24 bg-[#0f0f1a] relative">
      <div class="cc-container px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Tudo que você precisa</h2>
          <p class="text-neutral-400 text-lg">Uma plataforma completa para os cinéfilos</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (feature of features; track feature.title) {
            <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 hover:bg-white/15 transition-all duration-300 shadow-2xl shadow-[#2B4393]/10 flex flex-col items-center text-center">
              <div class="text-5xl mb-6">{{ feature.icon }}</div>
              <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
              <p class="text-sm text-neutral-400">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class FeaturesComponent {
  features = [
    { icon: '🎪', title: 'Clubes', description: 'Crie clubes exclusivos com seus amigos e organize as próximas idas.' },
    { icon: '💰', title: 'Rachadinhas', description: 'Divida os custos da pipoca e ingressos automaticamente sem stress.' },
    { icon: '🏆', title: 'Ranking', description: 'Veja quem é o maior cinéfilo do grupo com nosso ranking interativo.' },
    { icon: '📸', title: 'Memórias', description: 'Guarde fotos, avaliações e comentários de todas as sessões.' }
  ];
}
