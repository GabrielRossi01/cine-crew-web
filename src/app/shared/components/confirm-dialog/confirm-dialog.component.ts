import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal [isOpen]="isOpen" [title]="title" (closeModal)="onCancel()">
      <div class="text-neutral-300 mb-6">
        {{ message }}
      </div>
      <div class="flex justify-end gap-3 mt-4">
        <app-button variant="ghost" (click)="onCancel()">{{ cancelLabel }}</app-button>
        <app-button [variant]="variant" (click)="onConfirm()">{{ confirmLabel }}</app-button>
      </div>
    </app-modal>
  `,
  styles: [``]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar Ação';
  @Input() message = 'Tem certeza que deseja continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() variant: 'danger' | 'primary' = 'primary';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
