import { Component, signal } from '@angular/core';
import { ActivationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-backoffice-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="app-sidebar">
        <div class="brand">
          <span class="logo-dot">A</span>
          <span>Car Inspection</span>
        </div>
        <div class="nav-section">การตรวจสภาพรถ</div>
        <a routerLink="/backoffice/cidt01" routerLinkActive="active">
          <i class="fa-solid fa-clipboard-list"></i>รอนัดหมาย
        </a>
        <a routerLink="/backoffice/cidt02" routerLinkActive="active">
          <i class="fa-solid fa-calendar-day"></i>นัดหมาย
        </a>
        <a routerLink="/backoffice/cidt03" routerLinkActive="active">
          <i class="fa-solid fa-file-circle-check"></i>ผลตรวจ
        </a>
        <div class="nav-section">ลูกค้า</div>
        <a routerLink="/request" target="_blank">
          <i class="fa-solid fa-up-right-from-square"></i> เปิดหน้าลูกค้า
        </a>
      </aside>
      <main class="app-main">
        <header class="app-topbar">
          <div class="page-title">{{ pageTitle() }}</div>
          <div class="user-chip">
            <i class="fa-solid fa-user-shield"></i>
            <span>admin@appleman</span>
          </div>
        </header>
        <section class="app-content">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
})
export class BackofficeShellComponent {
  pageTitle = signal('Back Office');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is ActivationEnd => e instanceof ActivationEnd))
      .subscribe(e => {
        const title = e.snapshot.data?.['title'];
        if (title) this.pageTitle.set(title);
      });
  }
}
