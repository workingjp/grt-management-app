import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);

  show(message: string, durationMs = 3000): void {
    this.message.set(message);
    window.setTimeout(() => this.message.set(null), durationMs);
  }
}
