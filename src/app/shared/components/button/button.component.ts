import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getClasses()"
      class="rounded-full min-h-[44px] inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      @if (loading) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [``]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth = false;

  getClasses(): string {
    let classes = '';

    // Width
    if (this.fullWidth) classes += 'w-full ';

    // Size
    switch (this.size) {
      case 'sm': classes += 'px-3 py-1.5 text-sm '; break;
      case 'md': classes += 'px-5 py-2 text-base '; break;
      case 'lg': classes += 'px-8 py-3 text-lg '; break;
    }

    // Variant
    switch (this.variant) {
      case 'primary':
        classes += 'bg-[#2B4393] text-white hover:bg-[#2B4393]/90 focus:ring-[#2B4393] shadow-lg shadow-[#2B4393]/30 ';
        break;
      case 'secondary':
        classes += 'bg-accent text-[#0f0f1a] hover:bg-accent/90 focus:ring-accent shadow-lg shadow-accent/30 ';
        break;
      case 'danger':
        classes += 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30 ';
        break;
      case 'ghost':
        classes += 'bg-transparent text-neutral-100 hover:bg-white/10 focus:ring-white/20 border border-transparent hover:border-white/10 ';
        break;
    }

    return classes.trim();
  }
}
