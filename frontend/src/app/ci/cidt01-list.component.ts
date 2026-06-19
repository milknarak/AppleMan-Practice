import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { KpiCardComponent } from '../shared/kpi-card.component';
import { SnackbarService } from '../shared/snackbar.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { ThaiDatePipe } from '../shared/thaidate.pipe';
import {
  Cidt01Query, Cidt01Summary, CiMaster, CiRequest, PageResult,
} from './ci.model';
import { CiService } from './ci.service';

@Component({
  selector: 'app-cidt01-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, StatusBadgeComponent, ThaiDatePipe],
  templateUrl: './cidt01-list.component.html',
})
export class Cidt01ListComponent implements OnInit {
  private sv = inject(CiService);
  private snackbar = inject(SnackbarService);

  master = signal<CiMaster | null>(null);
  summary = signal<Cidt01Summary | null>(null);
  result  = signal<PageResult<CiRequest> | null>(null);
  loading = signal(false);

  query: Cidt01Query = {
    requestDateFrom: null, requestDateTo: null,
    carBrand: null, appointmentStatus: null, keyword: null,
  };
  page = 1;
  readonly pageSize = 10;

  // Selected row to detail panel
  selected = signal<CiRequest | null>(null);

  // Booking modal
  bookingOpen = signal(false);
  bookingTarget = signal<CiRequest | null>(null);
  bookingDate = '';
  bookingHub = '';
  bookingSlot = '';

  ngOnInit() {
    this.sv.getMaster().subscribe(m => this.master.set(m));
    this.search(true);
  }

  search(reset = false) {
    if (reset) this.page = 1;
    this.loading.set(true);
    this.sv.cidt01Search({ page: this.page, pageSize: this.pageSize }, this.query)
      .subscribe(r => { this.result.set(r); this.loading.set(false); });
    this.sv.cidt01Summary().subscribe(s => this.summary.set(s));
  }

  clear() {
    this.query = { requestDateFrom: null, requestDateTo: null, carBrand: null, appointmentStatus: null, keyword: null };
    this.search(true);
  }

  totalPages(): number {
    const r = this.result(); if (!r) return 1;
    return Math.max(1, Math.ceil(r.total / r.pageSize));
  }

  goPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p;
    this.search();
  }

  select(row: CiRequest) { this.selected.set(row); }

  openBooking(row: CiRequest, ev: Event) {
    ev.stopPropagation();
    this.bookingTarget.set(row);
    this.bookingDate = '';
    this.bookingHub = '';
    this.bookingSlot = '';
    this.bookingOpen.set(true);
  }

  confirmBooking() {
    const target = this.bookingTarget();
    if (!target) return;
    if (!this.bookingDate || !this.bookingHub || !this.bookingSlot) {
      this.snackbar.error('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    this.sv.bookAppointment(target.requestId, new Date(this.bookingDate), this.bookingHub, this.bookingSlot)
      .subscribe(() => {
        this.snackbar.success(`นัดหมาย ${target.requestFormNo} แล้ว`);
        this.bookingOpen.set(false);
        this.search();
      });
  }

  closeBooking() { this.bookingOpen.set(false); }
}
