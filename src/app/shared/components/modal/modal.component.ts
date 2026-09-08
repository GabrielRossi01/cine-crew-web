import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="close()"></div>

        <div class="relative w-full max-w-lg bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden animate-scale-in">

          <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 class="text-xl font-bold text-neutral-100">{{ title }}</h2>
            <button (click)="close()" class="text-neutral-400 hover:text-white transition-colors focus:outline-none" aria-label="Close">
              <span class="text-2xl leading-none">&times;</span>
            </button>
          </div>

          <div class="p-6">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes scale-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out forwards;
    }
  `]
})
export class ModalComponent {
  @Input({ required: true }) isOpen = false;
  @Input() title = '';
  @Output() closeModal = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onKeydownHandler(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  close() {
    this.closeModal.emit();
  }
}
