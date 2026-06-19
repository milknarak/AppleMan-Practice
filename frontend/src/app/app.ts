import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SnackbarComponent } from './shared/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SnackbarComponent],
  template: `
    <router-outlet></router-outlet>
    <app-snackbar></app-snackbar>
  `,
})
export class App {}
