import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage { text: string; kind: 'success' | 'error'; }

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  readonly current = signal<SnackbarMessage | null>(null);

  success(text: string) { this.show({ text, kind: 'success' }); }
  error(text: string)   { this.show({ text, kind: 'error'   }); }

  private show(m: SnackbarMessage) {
    this.current.set(m);
    setTimeout(() => this.current.set(null), 3000);
  }
}
