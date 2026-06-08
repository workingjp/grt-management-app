import { Component, inject } from '@angular/core';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  template: `
    @if (toast.message(); as msg) {
      <div class="snackbar" role="status">
        <svg class="snackbar__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clip-rule="evenodd"
          />
        </svg>
        {{ msg }}
      </div>
    }
  `,
  styles: `
    .snackbar {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.875rem 1.25rem;
      background: #0f172a;
      color: #ffffff;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2);
      z-index: 1100;
      animation: slide-up 0.25s ease;
    }

    .snackbar__icon {
      width: 1.125rem;
      height: 1.125rem;
      color: #4ade80;
      flex-shrink: 0;
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `,
})
export class SnackbarComponent {
  readonly toast = inject(ToastService);
}
