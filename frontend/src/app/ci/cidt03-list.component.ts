import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { KpiCardComponent } from '../shared/kpi-card.component';
import { SnackbarService } from '../shared/snackbar.service';
import { StatusBadgeComponent } from '../shared/status-badge.component';
import { ThaiDatePipe } from '../shared/thaidate.pipe';
import {
  Cidt03Query, Cidt03Summary, CiMaster, CiRequest, InspectionResult, PageResult,
} from './ci.model';
import { CiService } from './ci.service';

@Component({
  selector: 'app-cidt03-list',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent, StatusBadgeComponent, ThaiDatePipe],
  templateUrl: './cidt03-list.component.html',
})
export class Cidt03ListComponent implements OnInit {
  private sv = inject(CiService);
  private snackbar = inject(SnackbarService);

  master = signal<CiMaster | null>(null);
  summary = signal<Cidt03Summary | null>(null);
  result  = signal<PageResult<CiRequest> | null>(null);
  loading = signal(false);

  query: Cidt03Query = {
    inspectionDateFrom: null, inspectionDateTo: null,
    inspector: null, inspectionResult: null, keyword: null,
  };
  page = 1;
  readonly pageSize = 10;
  selected = signal<CiRequest | null>(null);

  // Save-result modal
  resultOpen = signal(false);
  resultTarget = signal<CiRequest | null>(null);
  formResult: InspectionResult = InspectionResult.Passed;
  formInspector = '';
  formPassed = 0;
  formFailed = 0;
  formRemark = '';

  readonly InspectionResult = InspectionResult;

  ngOnInit() {
    this.sv.getMaster().subscribe(m => this.master.set(m));
    this.search(true);
  }

  search(reset = false) {
    if (reset) this.page = 1;
    this.loading.set(true);
    this.sv.cidt03Search({ page: this.page, pageSize: this.pageSize }, this.query)
      .subscribe(r => { this.result.set(r); this.loading.set(false); });
    this.sv.cidt03Summary().subscribe(s => this.summary.set(s));
  }

  clear() {
    this.query = { inspectionDateFrom: null, inspectionDateTo: null, inspector: null, inspectionResult: null, keyword: null };
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

  openResult(row: CiRequest, ev: Event) {
    ev.stopPropagation();
    this.resultTarget.set(row);
    this.formResult = InspectionResult.Passed;
    this.formInspector = '';
    this.formPassed = 38;
    this.formFailed = 0;
    this.formRemark = '';
    this.resultOpen.set(true);
  }
  closeResult() { this.resultOpen.set(false); }

  confirmResult() {
    const target = this.resultTarget();
    if (!target) return;
    if (!this.formInspector) {
      this.snackbar.error('กรุณาเลือกผู้ตรวจ');
      return;
    }
    this.sv.saveInspectionResult(
      target.requestId, this.formResult, this.formInspector,
      this.formPassed, this.formFailed, this.formRemark
    ).subscribe(() => {
      this.snackbar.success(`บันทึกผลตรวจ ${target.requestFormNo} แล้ว`);
      this.resultOpen.set(false);
      this.search();
    });
  }
}
