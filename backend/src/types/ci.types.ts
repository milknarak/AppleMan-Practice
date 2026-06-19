/**
 * Shared types for AppleMan BE — mirrors the FE model. Kept independent from
 * the FE source so the BE compiles standalone; if they drift, that's a hint
 * the contract changed and both sides need to update.
 */

export enum AppointmentStatus {
  Pending = 'P',
  Booked  = 'B',
  Cancel  = 'X',
}

export enum MeetingStatus {
  NotMet = 'N',
  Met    = 'M',
}

export enum InspectionStatus {
  Wait       = 'W',
  InProgress = 'I',
  Done       = 'D',
}

export enum InspectionResult {
  Pending = 'P',
  Passed  = 'Y',
  Failed  = 'N',
}

export interface MasterOption { value: string; label: string; }

export interface CiRequest {
  requestId: string;
  requestFormNo: string;
  referenceId: string;
  requestDate: Date;
  appointmentStatus: AppointmentStatus;
  meetingStatus: MeetingStatus;
  inspectionStatus: InspectionStatus;
  inspectionResult: InspectionResult;

  carBrand: string;
  carModel: string;
  carYear: number;
  carColor: string;
  licensePlate: string;
  licenseProvince: string;
  mileage: number;

  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  addressProvince: string;
  dealerName: string;

  appointmentDate?: Date | null;
  hubName?: string | null;
  slotLabel?: string | null;

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

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
