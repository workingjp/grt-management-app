import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog">
      <h2 class="dialog__title">{{ data.title }}</h2>
      <p class="dialog__message">{{ data.message }}</p>
      <div class="dialog__actions">
        <button type="button" class="btn btn--secondary" (click)="dialogRef.close(false)">
          {{ data.cancelLabel ?? 'Cancel' }}
        </button>
        <button type="button" class="btn btn--danger" (click)="dialogRef.close(true)">
          {{ data.confirmLabel ?? 'Delete' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .dialog {
      padding: 1.5rem;
      min-width: 320px;
      max-width: 420px;
    }

    .dialog__title {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
    }

    .dialog__message {
      margin: 0 0 1.5rem;
      color: #475569;
      line-height: 1.5;
    }

    .dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .btn--secondary {
      background: #fff;
      border-color: #cbd5e1;
      color: #334155;
    }

    .btn--danger {
      background: #dc2626;
      color: #fff;
    }

    .btn--danger:hover {
      background: #b91c1c;
    }
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean>);
  readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
}
