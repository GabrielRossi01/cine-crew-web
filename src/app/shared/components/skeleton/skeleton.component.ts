import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (i of items; track i) {
      <div class="animate-pulse bg-white/10" [ngClass]="getClasses()"></div>
    }
  `,
  styles: [``]
})
export class SkeletonComponent {
  @Input() type: 'card' | 'text' | 'avatar' | 'line' = 'line';
  
  private _count = 1;
  @Input() set count(value: number) {
    this._count = value;
    this.items = Array(value).fill(0).map((x, i) => i);
  }
  get count() { return this._count; }
  
  items: number[] = [0];

  getClasses(): string {
    switch (this.type) {
      case 'card': return 'rounded-2xl h-64 w-full';
      case 'text': return 'h-4 rounded w-full mb-2';
      case 'avatar': return 'rounded-full h-12 w-12';
      case 'line': return 'h-3 rounded w-3/4 mb-2';
      default: return 'h-4 rounded w-full';
    }
  }
}
