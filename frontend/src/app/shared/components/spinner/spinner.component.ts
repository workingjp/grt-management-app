import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner" [class.spinner--sm]="size() === 'sm'" role="status" aria-label="Loading">
      <span class="spinner__ring"></span>
    </div>
  `,
  styles: `
    .spinner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner__ring {
      width: 2rem;
      height: 2rem;
      border: 3px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .spinner--sm .spinner__ring {
      width: 1.25rem;
      height: 1.25rem;
      border-width: 2px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md'>('md');
}
