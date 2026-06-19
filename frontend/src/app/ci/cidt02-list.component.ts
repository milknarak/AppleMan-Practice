import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { KpiCardComponent } from '../shared/kpi-card.component';
import { SnackbarService } from '../shared/snackbar.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { ThaiDatePipe } from '../shared/thaidate.pipe';
import {
  Cidt02Query, Cidt02Summary, CiMaster, CiRequest, PageResult,
} from './ci.model';
import { CiService } from './ci.service';

@Component({
  selector: 'app-cidt02-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, StatusBadgeComponent, ThaiDatePipe],
  templateUrl: './cidt02-list.component.html',
})
export class Cidt02ListComponent implements OnInit {
  private sv = inject(CiService);
  private snackbar = inject(SnackbarService);

  master = signal<CiMaster | null>(null);
  summary = signal<Cidt02Summary | null>(null);
  result  = signal<PageResult<CiRequest> | null>(null);
  loading = signal(false);

  query: Cidt02Query = {
    appointmentDateFrom: null, appointmentDateTo: null,
    hub: null, meetingStatus: null, keyword: null,
  };
  page = 1;
  readonly pageSize = 10;

  selected = signal<CiRequest | null>(null);

  ngOnInit() {
    this.sv.getMaster().subscribe(m => this.master.set(m));
    this.search(true);
  }

  search(reset = false) {
    if (reset) this.page = 1;
    this.loading.set(true);
    this.sv.cidt02Search({ page: this.page, pageSize: this.pageSize }, this.query)
      .subscribe(r => { this.result.set(r); this.loading.set(false); });
    this.sv.cidt02Summary().subscribe(s => this.summary.set(s));
  }

  clear() {
    this.query = { appointmentDateFrom: null, appointmentDateTo: null, hub: null, meetingStatus: null, keyword: null };
    this.search(true);
  }

  totalPages(): number {
    const r = this.result(); if (!r) return 1;
    return Math.max(1, Math.ceil(r.total / r.pageSize));
  }
  goPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p; this.search();
  }

  select(row: CiRequest) { this.selected.set(row); }

  markMet(row: CiRequest, ev: Event) {
    ev.stopPropagation();
    this.sv.markMet(row.requestId).subscribe(() => {
      this.snackbar.success(`บันทึกว่าพบลูกค้าแล้ว — ${row.requestFormNo}`);
      this.search();
    });
  }
}
