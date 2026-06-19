import {
  AppointmentStatus, CiRequest, InspectionResult, InspectionStatus,
  MeetingStatus, PageResult,
} from '../types/ci.types.js';
import { MASTER, REQUESTS, newRequestId, nextRequestFormNo } from '../data/ci-mock-data.js';

/**
 * Business logic for CI request lifecycle. The data store is an in-memory
 * array — swapping in a real DB later means replacing the array reads/writes
 * with repository calls; the public API of this service can stay the same.
 */

export interface Cidt01Query {
  requestDateFrom?: Date | null;
  requestDateTo?: Date | null;
  carBrand?: string | null;
  appointmentStatus?: string | null;
  keyword?: string | null;
}

export interface Cidt02Query {
  appointmentDateFrom?: Date | null;
  appointmentDateTo?: Date | null;
  hub?: string | null;
  meetingStatus?: string | null;
  keyword?: string | null;
}

export interface Cidt03Query {
  inspectionDateFrom?: Date | null;
  inspectionDateTo?: Date | null;
  inspector?: string | null;
  inspectionResult?: string | null;
  keyword?: string | null;
}

export interface CustomerRequestPayload {
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  carColor: string;
  licensePlate: string;
  licenseProvince: string;
  mileage: number;
  addressProvince: string;
  dealerName: string;
  remark?: string;
}

class CiServiceImpl {
  private requests = REQUESTS;

  getMaster() { return MASTER; }

  // === cidt01 ===

  cidt01Search(page: number, pageSize: number, q: Cidt01Query): PageResult<CiRequest> {
    let result = this.requests.filter(r =>
      r.appointmentStatus === AppointmentStatus.Pending ||
      r.appointmentStatus === AppointmentStatus.Cancel
    );
    if (q.requestDateFrom)     result = result.filter(r => r.requestDate >= q.requestDateFrom!);
    if (q.requestDateTo)       result = result.filter(r => r.requestDate <= endOfDay(q.requestDateTo!));
    if (q.carBrand)            result = result.filter(r => r.carBrand === q.carBrand);
    if (q.appointmentStatus)   result = result.filter(r => r.appointmentStatus === q.appointmentStatus);
    if (q.keyword) {
      const kw = q.keyword.toLowerCase();
      result = result.filter(r =>
        r.requestFormNo.toLowerCase().includes(kw) ||
        r.referenceId.toLowerCase().includes(kw) ||
        r.customerName.toLowerCase().includes(kw) ||
        r.licensePlate.toLowerCase().includes(kw));
    }
    return paginate(result.sort((a, b) => +b.requestDate - +a.requestDate), page, pageSize);
  }

  cidt01Summary() {
    return {
      waitingAppointment: this.requests.filter(r => r.appointmentStatus === AppointmentStatus.Pending).length,
      bookedToday:        this.requests.filter(r => r.appointmentStatus === AppointmentStatus.Booked && isToday(r.appointmentDate)).length,
      cancelled:          this.requests.filter(r => r.appointmentStatus === AppointmentStatus.Cancel).length,
      total:              this.requests.length,
    };
  }

  bookAppointment(requestId: string, appointmentDate: Date, hubCode: string, slotCode: string): CiRequest | null {
    const r = this.requests.find(x => x.requestId === requestId);
    if (!r) return null;
    r.appointmentStatus = AppointmentStatus.Booked;
    r.appointmentDate   = appointmentDate;
    r.hubName  = MASTER.hubs.find(h  => h.value === hubCode)?.label  ?? null;
    r.slotLabel = MASTER.slots.find(s => s.value === slotCode)?.label ?? null;
    return r;
  }

  // === cidt02 ===

  cidt02Search(page: number, pageSize: number, q: Cidt02Query): PageResult<CiRequest> {
    let result = this.requests.filter(r =>
      r.appointmentStatus === AppointmentStatus.Booked &&
      r.inspectionStatus !== InspectionStatus.Done
    );
    if (q.appointmentDateFrom) result = result.filter(r => r.appointmentDate && r.appointmentDate >= q.appointmentDateFrom!);
    if (q.appointmentDateTo)   result = result.filter(r => r.appointmentDate && r.appointmentDate <= endOfDay(q.appointmentDateTo!));
    if (q.hub)                 result = result.filter(r => r.hubName === MASTER.hubs.find(h => h.value === q.hub)?.label);
    if (q.meetingStatus)       result = result.filter(r => r.meetingStatus === q.meetingStatus);
    if (q.keyword) {
      const kw = q.keyword.toLowerCase();
      result = result.filter(r =>
        r.requestFormNo.toLowerCase().includes(kw) ||
        r.customerName.toLowerCase().includes(kw) ||
        r.licensePlate.toLowerCase().includes(kw));
    }
    return paginate(result.sort((a, b) => +(a.appointmentDate ?? 0) - +(b.appointmentDate ?? 0)), page, pageSize);
  }

  cidt02Summary() {
    const list = this.requests.filter(r => r.appointmentStatus === AppointmentStatus.Booked && r.inspectionStatus !== InspectionStatus.Done);
    const todayStart = startOfToday();
    return {
      upcomingAppointments: list.filter(r => r.appointmentDate && r.appointmentDate >= todayStart).length,
      metCustomer:          list.filter(r => r.meetingStatus === MeetingStatus.Met).length,
      awaitingInspection:   list.filter(r => r.inspectionStatus === InspectionStatus.Wait).length,
      total:                list.length,
    };
  }

  markMet(requestId: string): CiRequest | null {
    const r = this.requests.find(x => x.requestId === requestId);
    if (!r) return null;
    r.meetingStatus = MeetingStatus.Met;
    r.inspectionStatus = InspectionStatus.InProgress;
    return r;
  }

  // === cidt03 ===

  cidt03Search(page: number, pageSize: number, q: Cidt03Query): PageResult<CiRequest> {
    let result = this.requests.filter(r =>
      r.inspectionStatus === InspectionStatus.Done ||
      r.inspectionStatus === InspectionStatus.InProgress
    );
    if (q.inspectionDateFrom) result = result.filter(r => r.inspectionDate && r.inspectionDate >= q.inspectionDateFrom!);
    if (q.inspectionDateTo)   result = result.filter(r => r.inspectionDate && r.inspectionDate <= endOfDay(q.inspectionDateTo!));
    if (q.inspector)          result = result.filter(r => r.inspectorName === MASTER.inspectors.find(i => i.value === q.inspector)?.label);
    if (q.inspectionResult)   result = result.filter(r => r.inspectionResult === q.inspectionResult);
    if (q.keyword) {
      const kw = q.keyword.toLowerCase();
      result = result.filter(r =>
        r.requestFormNo.toLowerCase().includes(kw) ||
        r.customerName.toLowerCase().includes(kw) ||
        r.licensePlate.toLowerCase().includes(kw));
    }
    return paginate(result.sort((a, b) => +(b.inspectionDate ?? 0) - +(a.inspectionDate ?? 0)), page, pageSize);
  }

  cidt03Summary() {
    const list = this.requests.filter(r => r.inspectionStatus === InspectionStatus.Done || r.inspectionStatus === InspectionStatus.InProgress);
    return {
      passed:        list.filter(r => r.inspectionResult === InspectionResult.Passed).length,
      failed:        list.filter(r => r.inspectionResult === InspectionResult.Failed).length,
      pendingResult: list.filter(r => r.inspectionResult === InspectionResult.Pending).length,
      total:         list.length,
    };
  }

  saveInspectionResult(requestId: string, result: InspectionResult, inspectorCode: string,
                       passed: number, failed: number, remark: string): CiRequest | null {
    const r = this.requests.find(x => x.requestId === requestId);
    if (!r) return null;
    r.inspectionStatus = InspectionStatus.Done;
    r.inspectionResult = result;
    r.inspectionDate   = new Date();
    r.inspectorName    = MASTER.inspectors.find(i => i.value === inspectorCode)?.label ?? inspectorCode;
    r.passedItems      = passed;
    r.failedItems      = failed;
    r.resultRemark     = remark;
    return r;
  }

  getRequest(requestId: string): CiRequest | undefined {
    return this.requests.find(r => r.requestId === requestId);
  }

  // === Customer ===

  submitCustomerRequest(p: CustomerRequestPayload): { requestFormNo: string } {
    const dealerLabel = MASTER.dealers.find(d => d.value === p.dealerName)?.label ?? p.dealerName;
    const newReq: CiRequest = {
      requestId: newRequestId(),
      requestFormNo: nextRequestFormNo(),
      referenceId: 'CUST' + Math.floor(Math.random() * 90000 + 10000),
      requestDate: new Date(),
      appointmentStatus: AppointmentStatus.Pending,
      meetingStatus: MeetingStatus.NotMet,
      inspectionStatus: InspectionStatus.Wait,
      inspectionResult: InspectionResult.Pending,
      carBrand: p.carBrand, carModel: p.carModel, carYear: p.carYear, carColor: p.carColor,
      licensePlate: p.licensePlate, licenseProvince: p.licenseProvince, mileage: p.mileage,
      customerName: p.customerName, customerMobile: p.customerMobile, customerEmail: p.customerEmail,
      addressProvince: p.addressProvince, dealerName: dealerLabel,
      appointmentDate: null, hubName: null, slotLabel: null,
      inspectionDate: null, inspectorName: null,
      remark: p.remark,
    };
    this.requests.unshift(newReq);
    return { requestFormNo: newReq.requestFormNo };
  }
}

export const ciService = new CiServiceImpl();

// === Helpers ===

function paginate<T>(arr: T[], page: number, pageSize: number): PageResult<T> {
  const items = arr.slice((page - 1) * pageSize, page * pageSize);
  return { items, total: arr.length, page, pageSize };
}
function endOfDay(d: Date): Date { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }
function startOfToday(): Date    { const x = new Date(); x.setHours(0, 0, 0, 0); return x; }
function isToday(d?: Date | null): boolean {
  if (!d) return false;
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
