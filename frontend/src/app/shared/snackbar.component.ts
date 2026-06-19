import { Component, inject } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  template: `
    @if (svc.current(); as msg) {
      <div class="snackbar" [class.error]="msg.kind === 'error'">{{ msg.text }}</div>
    }
  `,
})
export class SnackbarComponent {
  svc = inject(SnackbarService);
}
