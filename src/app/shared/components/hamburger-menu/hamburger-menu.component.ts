import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  template: `
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-[#FFC250]/50 hover:bg-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC250] dark:text-white light:border-slate-900/10 light:bg-white/60 light:text-slate-800"
      [attr.aria-label]="isOpen ? 'Fechar menu' : 'Abrir menu'"
      [attr.aria-expanded]="isOpen"
      (click)="toggle.emit()"
    >
      <svg
        class="h-5 w-5 transition-transform duration-300"
        [class.rotate-90]="isOpen"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        aria-hidden="true"
      >
        @if (isOpen) {
          <path d="M6 6l12 12M18 6 6 18"></path>
        } @else {
          <path d="M4 7h16M4 12h16M4 17h16"></path>
        }
      </svg>
    </button>
  `,
})
export class HamburgerMenuComponent {
  @Input({ required: true }) isOpen = false;
  @Output() readonly toggle = new EventEmitter<void>();
}
