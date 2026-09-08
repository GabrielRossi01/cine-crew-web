import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#2B4393]/30 to-[#0f0f1a] pt-20">
      <!-- Decorative background circles -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2B4393]/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFC250]/10 rounded-full blur-3xl opacity-50 animate-pulse" style="animation-delay: 2s;"></div>
      
      <!-- Floating glass elements -->
      <div class="absolute top-1/3 left-10 w-24 h-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl animate-[float_4s_ease-in-out_infinite] rotate-[-10deg] hidden lg:flex items-center justify-center">
        <span class="text-4xl opacity-50">🍿</span>
      </div>
      <div class="absolute bottom-1/3 right-10 w-28 h-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl animate-[float_5s_ease-in-out_infinite_1s] rotate-[15deg] hidden lg:flex items-center justify-center">
        <span class="text-5xl opacity-50">🎟️</span>
      </div>
      <div class="absolute top-1/4 right-1/4 w-20 h-28 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl animate-[float_4.5s_ease-in-out_infinite_0.5s] rotate-[5deg] hidden md:flex items-center justify-center">
        <span class="text-3xl opacity-50">🎞️</span>
      </div>

      <!-- Main content -->
      <div class="relative z-10 cc-container text-center px-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-[fadeInUp_1s_ease-out]">
          <span class="text-sm font-medium text-neutral-200">🎬 Your Crew, Your Screen</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight mb-6 animate-[fadeInUp_1s_ease-out]">
          Organize suas idas ao cinema com seus amigos
        </h1>
        
        <p class="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 animate-[fadeInUp_1s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
          Centralize pagamentos, fotos e memórias em um só lugar.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_1s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
          <a routerLink="/register" class="w-full sm:w-auto bg-[#2B4393] hover:bg-[#3d5ac2] text-white rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(43,67,147,0.4)] hover:shadow-[0_0_30px_rgba(43,67,147,0.6)] flex items-center justify-center min-w-[200px]">
            Criar meu clube
          </a>
          <a routerLink="/login" class="w-full sm:w-auto border-2 border-[#FFC250] text-[#FFC250] hover:bg-[#FFC250] hover:text-[#0f0f1a] rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 flex items-center justify-center min-w-[200px]">
            Entrar
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
      50% { transform: translateY(-20px) rotate(calc(var(--tw-rotate) + 5deg)); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeroComponent {}
