import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section class="py-24 bg-[#1a1a2e] relative overflow-hidden">
      <div class="cc-container px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-16 text-center">O que dizem nossos usuários</h2>
        
        <div class="relative max-w-5xl mx-auto">
          <!-- Desktop Grid -->
          <div class="hidden md:grid grid-cols-3 gap-6">
            @for (testimonial of testimonials; track testimonial.name) {
              <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B4393] to-[#FFC250] flex items-center justify-center text-white font-bold text-lg">
                    {{ testimonial.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-white font-semibold">{{ testimonial.name }}</div>
                  </div>
                </div>
                <p class="text-neutral-300 italic flex-grow">"{{ testimonial.text }}"</p>
              </div>
            }
          </div>

          <!-- Mobile Carousel -->
          <div class="md:hidden relative overflow-hidden min-h-[250px]">
             @for (testimonial of testimonials; track testimonial.name; let i = $index) {
                <div 
                  class="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
                  [class.opacity-0]="currentIndex() !== i"
                  [class.opacity-100]="currentIndex() === i"
                  [class.translate-x-0]="currentIndex() === i"
                  [class.translate-x-full]="i > currentIndex()"
                  [class.-translate-x-full]="i < currentIndex()">
                  <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mx-4">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B4393] to-[#FFC250] flex items-center justify-center text-white font-bold text-lg">
                        {{ testimonial.name.charAt(0) }}
                      </div>
                      <div class="text-white font-semibold">{{ testimonial.name }}</div>
                    </div>
                    <p class="text-neutral-300 italic">"{{ testimonial.text }}"</p>
                  </div>
                </div>
             }
          </div>

          <!-- Indicators -->
          <div class="flex justify-center mt-8 gap-2 md:hidden">
            @for (t of testimonials; track t.name; let i = $index) {
              <button 
                class="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                [class.bg-[#FFC250]]="currentIndex() === i"
                [class.bg-white/30]="currentIndex() !== i"
                (click)="currentIndex.set(i)"
                aria-label="Ir para depoimento"
              ></button>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  testimonials = [
    { name: 'Ana L.', text: 'O CineCrew mudou a forma como organizo as idas ao cinema com meus amigos. Super prático!' },
    { name: 'Pedro H.', text: 'A rachadinha automática é incrível. Nunca mais tive problema para dividir os custos.' },
    { name: 'Julia S.', text: 'Adoro o feed de memórias! É como ter um álbum de fotos de todas as nossas idas ao cinema.' }
  ];

  currentIndex = signal(0);
  private intervalId: any;

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  private startCarousel() {
    if (typeof window !== 'undefined') {
      this.intervalId = setInterval(() => {
        this.currentIndex.update(v => (v + 1) % this.testimonials.length);
      }, 5000);
    }
  }

  private stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
