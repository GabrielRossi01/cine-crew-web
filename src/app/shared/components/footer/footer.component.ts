import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white/5 backdrop-blur-xl border-t border-white/10 py-8 mt-auto transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col items-center md:items-start">
            <span class="text-xl font-bold text-neutral-100 flex items-center gap-2">
              🎬 CineCrew
            </span>
            <span class="text-sm text-neutral-400 mt-1">Your Crew, Your Screen.</span>
          </div>
          
          <div class="flex gap-6 text-sm text-neutral-400">
            <a href="#" class="hover:text-accent transition-colors">Termos</a>
            <a href="#" class="hover:text-accent transition-colors">Privacidade</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-accent transition-colors">GitHub</a>
          </div>

          <div class="text-sm text-neutral-500">
            &copy; {{ currentYear }} CineCrew. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [``]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
