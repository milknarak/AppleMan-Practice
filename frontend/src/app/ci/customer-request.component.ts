import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SnackbarService } from '../shared/snackbar.service';
import { CiMaster } from './ci.model';
import { CiService } from './ci.service';

@Component({
  selector: 'app-customer-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-request.component.html',
})
export class CustomerRequestComponent implements OnInit {
  private sv = inject(CiService);
  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);

  master = signal<CiMaster | null>(null);
  submitted = signal<{ requestFormNo: string } | null>(null);
  submitting = signal(false);

  form = this.fb.group({
    customerName:    ['', [Validators.required, Validators.minLength(2)]],
    customerMobile:  ['', [Validators.required, Validators.pattern(/^[0-9-]{9,15}$/)]],
    customerEmail:   ['', [Validators.email]],
    carBrand:        ['', Validators.required],
    carModel:        ['', Validators.required],
    carYear:         [new Date().getFullYear(), [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]],
    carColor:        ['', Validators.required],
    licensePlate:    ['', Validators.required],
    licenseProvince: ['', Validators.required],
    mileage:         [0, [Validators.required, Validators.min(0)]],
    addressProvince: ['', Validators.required],
    dealerName:      ['', Validators.required],
    remark:          [''],
  });

  ngOnInit() {
    this.sv.getMaster().subscribe(m => this.master.set(m));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.error('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    this.submitting.set(true);
    const v = this.form.getRawValue();
    this.sv.submitCustomerRequest({
      customerName:    v.customerName!,
      customerMobile:  v.customerMobile!,
      customerEmail:   v.customerEmail || undefined,
      carBrand:        v.carBrand!,
      carModel:        v.carModel!,
      carYear:         v.carYear!,
      carColor:        v.carColor!,
      licensePlate:    v.licensePlate!,
      licenseProvince: v.licenseProvince!,
      mileage:         v.mileage!,
      addressProvince: v.addressProvince!,
      dealerName:      this.dealerLabel(v.dealerName!) ?? v.dealerName!,
      remark:          v.remark || undefined,
    }).subscribe(res => {
      this.submitting.set(false);
      this.submitted.set(res);
    });
  }

  reset() {
    this.submitted.set(null);
    this.form.reset({ carYear: new Date().getFullYear(), mileage: 0 });
  }

  private dealerLabel(code: string): string | undefined {
    return this.master()?.dealers.find(d => d.value === code)?.label;
  }
}
