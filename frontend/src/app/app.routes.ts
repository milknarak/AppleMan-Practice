import { Routes } from '@angular/router';

import { BackofficeShellComponent } from './shared/backoffice-shell.component';
import { Cidt01ListComponent } from './ci/cidt01-list.component';
import { Cidt02ListComponent } from './ci/cidt02-list.component';
import { Cidt03ListComponent } from './ci/cidt03-list.component';
import { CustomerRequestComponent } from './ci/customer-request.component';

export const routes: Routes = [
  { path: '', redirectTo: 'backoffice/cidt01', pathMatch: 'full' },
  {
    path: 'backoffice',
    component: BackofficeShellComponent,
    children: [
      { path: '', redirectTo: 'cidt01', pathMatch: 'full' },
      { path: 'cidt01', component: Cidt01ListComponent, data: { title: 'CIDT01 — รอนัดหมายตรวจสภาพรถ' } },
      { path: 'cidt02', component: Cidt02ListComponent, data: { title: 'CIDT02 — รายการนัดหมายตรวจสภาพรถ' } },
      { path: 'cidt03', component: Cidt03ListComponent, data: { title: 'CIDT03 — ผลตรวจสภาพรถ' } },
    ],
  },
  { path: 'request', component: CustomerRequestComponent },
  { path: '**', redirectTo: 'backoffice/cidt01' },
];
