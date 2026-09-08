import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[700] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4 pr-10 relative overflow-hidden transition-all duration-300 animate-slide-in-right"
             [ngClass]="getBorderClass(toast.type)">
          
          <div class="absolute left-0 top-0 bottom-0 w-1" [ngClass]="getBgClass(toast.type)"></div>
          
          <div class="text-neutral-100 text-sm font-medium">
            {{ toast.message }}
          </div>
          
          <button (click)="toastService.dismiss(toast.id)" class="absolute top-4 right-3 text-neutral-400 hover:text-white transition-colors">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getBorderClass(type: string): string {
    switch(type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-amber-500';
      default: return 'border-l-blue-500';
    }
  }

  getBgClass(type: string): string {
    switch(type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  }
}
