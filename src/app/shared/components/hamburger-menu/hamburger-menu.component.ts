import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      (click)="onClick()"
      class="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
      aria-label="Menu">
      <div class="flex flex-col gap-1.5 w-6">
        <span class="block h-0.5 bg-neutral-100 rounded-full transition-all duration-300 ease-in-out" [class.rotate-45]="isOpen" [class.translate-y-2]="isOpen"></span>
        <span class="block h-0.5 bg-neutral-100 rounded-full transition-all duration-300 ease-in-out" [class.opacity-0]="isOpen"></span>
        <span class="block h-0.5 bg-neutral-100 rounded-full transition-all duration-300 ease-in-out" [class.-rotate-45]="isOpen" [class.-translate-y-2]="isOpen"></span>
      </div>
    </button>
  `,
  styles: [``]
})
export class HamburgerMenuComponent {
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();

  onClick() {
    this.toggle.emit();
  }
}
