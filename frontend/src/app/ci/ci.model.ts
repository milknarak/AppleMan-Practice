/**
 * Domain model for AppleMan Practice — Car Inspection request lifecycle.
 * Simplified port of CiRequestList from the real customer project: only the
 * fields needed to demonstrate cidt01/02/03 + customer-facing request flow.
 */

export enum AppointmentStatus {
  Pending = 'P',   // ยังไม่ได้นัด
  Booked  = 'B',   // นัดแล้ว
  Cancel  = 'X',   // ยกเลิก
}

export enum MeetingStatus {
  NotMet  = 'N',   // ยังไม่ได้พบ
  Met     = 'M',   // พบลูกค้าแล้ว
}

export enum InspectionStatus {
  Wait        = 'W',   // รอตรวจ
  InProgress  = 'I',   // กำลังตรวจ
  Done        = 'D',   // ตรวจเสร็จ
}

export enum InspectionResult {
  Pending = 'P',   // ยังไม่สรุปผล
  Passed  = 'Y',   // ผ่าน
  Failed  = 'N',   // ไม่ผ่าน
}

export interface MasterOption { value: string; label: string; }

export interface CiRequest {
  requestId: string;
  requestFormNo: string;        // เลขที่คำขอ
  referenceId: string;          // เลขอ้างอิงดีลเลอร์
  requestDate: Date;            // วันที่ยื่นคำขอ
  appointmentStatus: AppointmentStatus;
  meetingStatus: MeetingStatus;
  inspectionStatus: InspectionStatus;
  inspectionResult: InspectionResult;

  // Car
  carBrand: string;
  carModel: string;
  carYear: number;
  carColor: string;
  licensePlate: string;
  licenseProvince: string;
  mileage: number;

  // Customer
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  addressProvince: string;
  dealerName: string;

  // Appointment
  appointmentDate?: Date | null;
  hubName?: string | null;
  slotLabel?: string | null;

  // Result
  inspectionDate?: Date | null;
  inspectorName?: string | null;
  resultRemark?: string | null;
  passedItems?: number;
  failedItems?: number;

  remark?: string;
}

export interface CiMaster {
  appointmentStatus: MasterOption[];
  meetingStatus: MasterOption[];
  inspectionStatus: MasterOption[];
  inspectionResult: MasterOption[];
  carBrands: MasterOption[];
  provinces: MasterOption[];
  dealers: MasterOption[];
  hubs: MasterOption[];
  slots: MasterOption[];
  inspectors: MasterOption[];
}

export interface Cidt01Summary {
  waitingAppointment: number;
  bookedToday: number;
  cancelled: number;
  total: number;
}

export interface Cidt02Summary {
  upcomingAppointments: number;
  metCustomer: number;
  awaitingInspection: number;
  total: number;
}

export interface Cidt03Summary {
  passed: number;
  failed: number;
  pendingResult: number;
  total: number;
}

export interface PageRequest { page: number; pageSize: number; }
export interface PageResult<T> { items: T[]; total: number; page: number; pageSize: number; }

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
