import {
  AppointmentStatus, CiMaster, CiRequest, InspectionResult,
  InspectionStatus, MasterOption, MeetingStatus,
} from '../types/ci.types.js';

export const PROVINCES: MasterOption[] = [
  { value: 'BKK', label: 'กรุงเทพมหานคร' },
  { value: 'NBI', label: 'นนทบุรี' },
  { value: 'PT',  label: 'ปทุมธานี' },
  { value: 'SP',  label: 'สมุทรปราการ' },
  { value: 'CM',  label: 'เชียงใหม่' },
  { value: 'CB',  label: 'ชลบุรี' },
  { value: 'KK',  label: 'ขอนแก่น' },
  { value: 'PK',  label: 'ภูเก็ต' },
];

export const CAR_BRANDS: MasterOption[] = [
  { value: 'TOYOTA',     label: 'Toyota' },
  { value: 'HONDA',      label: 'Honda' },
  { value: 'ISUZU',      label: 'Isuzu' },
  { value: 'MAZDA',      label: 'Mazda' },
  { value: 'MITSUBISHI', label: 'Mitsubishi' },
  { value: 'NISSAN',     label: 'Nissan' },
  { value: 'FORD',       label: 'Ford' },
  { value: 'MG',         label: 'MG' },
  { value: 'BYD',        label: 'BYD' },
];

export const DEALERS: MasterOption[] = [
  { value: 'D001', label: 'Apple Auto Bangkok' },
  { value: 'D002', label: 'Apple Auto Nonthaburi' },
  { value: 'D003', label: 'Apple Auto Chiang Mai' },
  { value: 'D004', label: 'Apple Auto Phuket' },
];

export const HUBS: MasterOption[] = [
  { value: 'H001', label: 'Hub กรุงเทพ — รามอินทรา' },
  { value: 'H002', label: 'Hub กรุงเทพ — บางนา' },
  { value: 'H003', label: 'Hub นนทบุรี' },
  { value: 'H004', label: 'Hub เชียงใหม่' },
  { value: 'H005', label: 'Hub ภูเก็ต' },
];

export const SLOTS: MasterOption[] = [
  { value: '09-10', label: '09:00 - 10:00' },
  { value: '10-11', label: '10:00 - 11:00' },
  { value: '11-12', label: '11:00 - 12:00' },
  { value: '13-14', label: '13:00 - 14:00' },
  { value: '14-15', label: '14:00 - 15:00' },
  { value: '15-16', label: '15:00 - 16:00' },
];

export const INSPECTORS: MasterOption[] = [
  { value: 'INS01', label: 'สมชาย วงศ์วิทย์' },
  { value: 'INS02', label: 'ณัฐพล ปัญญาดี' },
  { value: 'INS03', label: 'วราพร แก้วใส' },
  { value: 'INS04', label: 'อนุชา รุ่งโรจน์' },
];

export const APPOINTMENT_STATUS_OPTS: MasterOption[] = [
  { value: AppointmentStatus.Pending, label: 'รอนัดหมาย' },
  { value: AppointmentStatus.Booked,  label: 'นัดหมายแล้ว' },
  { value: AppointmentStatus.Cancel,  label: 'ยกเลิก' },
];

export const MEETING_STATUS_OPTS: MasterOption[] = [
  { value: MeetingStatus.NotMet, label: 'ยังไม่ได้พบ' },
  { value: MeetingStatus.Met,    label: 'พบลูกค้าแล้ว' },
];

export const INSPECTION_STATUS_OPTS: MasterOption[] = [
  { value: InspectionStatus.Wait,       label: 'รอตรวจ' },
  { value: InspectionStatus.InProgress, label: 'กำลังตรวจ' },
  { value: InspectionStatus.Done,       label: 'ตรวจเสร็จ' },
];

export const INSPECTION_RESULT_OPTS: MasterOption[] = [
  { value: InspectionResult.Pending, label: 'รอสรุปผล' },
  { value: InspectionResult.Passed,  label: 'ผ่าน' },
  { value: InspectionResult.Failed,  label: 'ไม่ผ่าน' },
];

export const MASTER: CiMaster = {
  appointmentStatus: APPOINTMENT_STATUS_OPTS,
  meetingStatus:     MEETING_STATUS_OPTS,
  inspectionStatus:  INSPECTION_STATUS_OPTS,
  inspectionResult:  INSPECTION_RESULT_OPTS,
  carBrands:         CAR_BRANDS,
  provinces:         PROVINCES,
  dealers:           DEALERS,
  hubs:              HUBS,
  slots:             SLOTS,
  inspectors:        INSPECTORS,
};

// Helpers

function daysAgo(n: number): Date {
  const d = new Date(); d.setDate(d.getDate() - n); d.setHours(9, 0, 0, 0);
  return d;
}
function daysAhead(n: number): Date {
  const d = new Date(); d.setDate(d.getDate() + n); d.setHours(9, 0, 0, 0);
  return d;
}

let _seq = 1;
function nextNo(prefix: string): string {
  const y = new Date().getFullYear() + 543;
  return `${prefix}${y}/${String(_seq++).padStart(5, '0')}`;
}

// Seed: 24 requests spread across the 3 stages
export const REQUESTS: CiRequest[] = [
  // === cidt01: 8 รอนัดหมาย (just submitted, no appointment yet) ===
  buildRequest({
    requestDate: daysAgo(1),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'ปฐมพงษ์ สวยงาม', mobile: '081-234-5678',
    carBrand: 'TOYOTA', carModel: 'Camry 2.5 HV', carYear: 2018, carColor: 'ขาว',
    plate: 'กก-1234', plateProv: 'BKK', mileage: 68000,
    dealer: 'D001', addrProv: 'BKK',
  }),
  buildRequest({
    requestDate: daysAgo(1),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'วันชัย แสงทอง', mobile: '089-555-1212',
    carBrand: 'HONDA', carModel: 'Civic RS', carYear: 2020, carColor: 'ดำ',
    plate: 'ขข-4521', plateProv: 'NBI', mileage: 42000,
    dealer: 'D002', addrProv: 'NBI',
  }),
  buildRequest({
    requestDate: daysAgo(2),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'สุนิสา ปลื้มใจ', mobile: '062-777-3456',
    carBrand: 'MAZDA', carModel: 'CX-5 SP', carYear: 2019, carColor: 'แดง',
    plate: 'งง-8829', plateProv: 'PT', mileage: 51000,
    dealer: 'D001', addrProv: 'PT',
  }),
  buildRequest({
    requestDate: daysAgo(2),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'อภิชาติ เกษมสุข', mobile: '094-118-2244',
    carBrand: 'ISUZU', carModel: 'D-Max V-Cross', carYear: 2021, carColor: 'เทา',
    plate: 'จจ-1100', plateProv: 'CB', mileage: 25000,
    dealer: 'D001', addrProv: 'CB',
  }),
  buildRequest({
    requestDate: daysAgo(3),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'จิราภรณ์ ไชยศรี', mobile: '083-901-7733',
    carBrand: 'MG', carModel: 'ZS EV', carYear: 2022, carColor: 'ฟ้า',
    plate: 'ฉฉ-2255', plateProv: 'BKK', mileage: 18000,
    dealer: 'D002', addrProv: 'BKK',
  }),
  buildRequest({
    requestDate: daysAgo(3),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'ภัทรา พงศ์พันธ์', mobile: '095-555-8800',
    carBrand: 'BYD', carModel: 'Atto 3', carYear: 2023, carColor: 'เงิน',
    plate: 'ชช-7780', plateProv: 'CM', mileage: 11500,
    dealer: 'D003', addrProv: 'CM',
  }),
  buildRequest({
    requestDate: daysAgo(4),
    appointmentStatus: AppointmentStatus.Pending,
    customerName: 'กิตติศักดิ์ พินิจ', mobile: '081-808-1818',
    carBrand: 'FORD', carModel: 'Ranger Wildtrak', carYear: 2017, carColor: 'ส้ม',
    plate: 'ซซ-3030', plateProv: 'KK', mileage: 92000,
    dealer: 'D001', addrProv: 'KK',
  }),
  buildRequest({
    requestDate: daysAgo(5),
    appointmentStatus: AppointmentStatus.Cancel,
    customerName: 'ดวงใจ จันทร์เจริญ', mobile: '084-321-1199',
    carBrand: 'NISSAN', carModel: 'Almera VL', carYear: 2019, carColor: 'น้ำตาล',
    plate: 'ฌฌ-5500', plateProv: 'SP', mileage: 60000,
    dealer: 'D001', addrProv: 'SP',
    remark: 'ลูกค้าขอยกเลิก ติดธุระต่างจังหวัด',
  }),

  // === cidt02: 8 นัดหมายแล้ว (booked, some met, awaiting inspection) ===
  buildBooked({
    requestDate: daysAgo(7), appointmentDate: daysAhead(1),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'สมศักดิ์ บูรพา', mobile: '081-101-2020',
    carBrand: 'TOYOTA', carModel: 'Vios Smart', carYear: 2020, carColor: 'ขาวมุก',
    plate: 'กก-7891', plateProv: 'BKK', mileage: 35000,
    dealer: 'D001', addrProv: 'BKK',
    hub: 'H001', slot: '10-11',
  }),
  buildBooked({
    requestDate: daysAgo(7), appointmentDate: daysAhead(1),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'ปริญญา ดีงาม', mobile: '089-222-3344',
    carBrand: 'HONDA', carModel: 'CR-V SP-V', carYear: 2019, carColor: 'เทาเข้ม',
    plate: 'ขข-9988', plateProv: 'NBI', mileage: 58000,
    dealer: 'D002', addrProv: 'NBI',
    hub: 'H003', slot: '13-14',
  }),
  buildBooked({
    requestDate: daysAgo(6), appointmentDate: daysAhead(2),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'พรเพ็ญ ใจซื่อ', mobile: '063-101-4040',
    carBrand: 'ISUZU', carModel: 'MU-X', carYear: 2020, carColor: 'ดำเงา',
    plate: 'งง-3322', plateProv: 'CB', mileage: 47000,
    dealer: 'D001', addrProv: 'CB',
    hub: 'H002', slot: '14-15',
  }),
  buildBooked({
    requestDate: daysAgo(8), appointmentDate: daysAgo(1),
    meetingStatus: MeetingStatus.Met,
    inspectionStatus: InspectionStatus.InProgress,
    customerName: 'จักรพันธ์ ก้าวหน้า', mobile: '081-707-1414',
    carBrand: 'MAZDA', carModel: 'Mazda 2', carYear: 2018, carColor: 'แดงเลือดหมู',
    plate: 'จจ-6677', plateProv: 'BKK', mileage: 75000,
    dealer: 'D002', addrProv: 'BKK',
    hub: 'H001', slot: '09-10',
  }),
  buildBooked({
    requestDate: daysAgo(8), appointmentDate: daysAhead(3),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'อรอุมา ฤทธิรงค์', mobile: '098-555-7766',
    carBrand: 'TOYOTA', carModel: 'Yaris Cross', carYear: 2022, carColor: 'น้ำเงิน',
    plate: 'ฉฉ-2244', plateProv: 'PT', mileage: 15000,
    dealer: 'D001', addrProv: 'PT',
    hub: 'H003', slot: '11-12',
  }),
  buildBooked({
    requestDate: daysAgo(9), appointmentDate: daysAhead(2),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'ธีรพงษ์ มั่นคง', mobile: '081-606-1313',
    carBrand: 'MITSUBISHI', carModel: 'Pajero Sport', carYear: 2017, carColor: 'ขาว',
    plate: 'ชช-1010', plateProv: 'CM', mileage: 102000,
    dealer: 'D003', addrProv: 'CM',
    hub: 'H004', slot: '10-11',
  }),
  buildBooked({
    requestDate: daysAgo(10), appointmentDate: daysAhead(4),
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    customerName: 'รัตติกาล ขวัญใจ', mobile: '094-303-2121',
    carBrand: 'MG', carModel: 'HS PHEV', carYear: 2023, carColor: 'ขาว',
    plate: 'ซซ-9090', plateProv: 'PK', mileage: 8500,
    dealer: 'D004', addrProv: 'PK',
    hub: 'H005', slot: '15-16',
  }),
  buildBooked({
    requestDate: daysAgo(11), appointmentDate: daysAgo(0),
    meetingStatus: MeetingStatus.Met,
    inspectionStatus: InspectionStatus.InProgress,
    customerName: 'นพพล สังข์ทอง', mobile: '083-808-4545',
    carBrand: 'NISSAN', carModel: 'Note e-Power', carYear: 2021, carColor: 'แดง',
    plate: 'ฌฌ-3434', plateProv: 'BKK', mileage: 22000,
    dealer: 'D002', addrProv: 'BKK',
    hub: 'H001', slot: '13-14',
  }),

  // === cidt03: 8 inspected (results) ===
  buildInspected({
    requestDate: daysAgo(20), appointmentDate: daysAgo(13), inspectionDate: daysAgo(13),
    result: InspectionResult.Passed,
    customerName: 'สมหญิง รักษ์ดี', mobile: '081-222-3434',
    carBrand: 'TOYOTA', carModel: 'Hilux Revo', carYear: 2018, carColor: 'เทา',
    plate: 'กก-5500', plateProv: 'BKK', mileage: 88000,
    dealer: 'D001', addrProv: 'BKK', hub: 'H001', slot: '10-11',
    inspector: 'INS01', passed: 38, failed: 0,
    remark: 'รถสภาพดีพร้อมขาย',
  }),
  buildInspected({
    requestDate: daysAgo(22), appointmentDate: daysAgo(14), inspectionDate: daysAgo(14),
    result: InspectionResult.Passed,
    customerName: 'วันชนะ ไกรเกียรติ', mobile: '089-414-9090',
    carBrand: 'HONDA', carModel: 'City RS', carYear: 2021, carColor: 'แดง',
    plate: 'ขข-6611', plateProv: 'NBI', mileage: 28000,
    dealer: 'D002', addrProv: 'NBI', hub: 'H003', slot: '11-12',
    inspector: 'INS02', passed: 36, failed: 2,
    remark: 'มีรอยขนเล็กน้อยที่กันชนหลัง',
  }),
  buildInspected({
    requestDate: daysAgo(25), appointmentDate: daysAgo(18), inspectionDate: daysAgo(18),
    result: InspectionResult.Failed,
    customerName: 'พิชัย รุ่งสว่าง', mobile: '094-505-1717',
    carBrand: 'MAZDA', carModel: 'BT-50', carYear: 2016, carColor: 'ขาว',
    plate: 'งง-2255', plateProv: 'KK', mileage: 145000,
    dealer: 'D001', addrProv: 'KK', hub: 'H002', slot: '14-15',
    inspector: 'INS03', passed: 18, failed: 12,
    remark: 'พบรอยน้ำท่วม และเครื่องยนต์มีอาการน็อค',
  }),
  buildInspected({
    requestDate: daysAgo(28), appointmentDate: daysAgo(21), inspectionDate: daysAgo(21),
    result: InspectionResult.Passed,
    customerName: 'จันทร์ทิพย์ ผ่องใส', mobile: '083-919-2828',
    carBrand: 'TOYOTA', carModel: 'Corolla Cross HEV', carYear: 2022, carColor: 'ขาวมุก',
    plate: 'จจ-9911', plateProv: 'BKK', mileage: 22000,
    dealer: 'D001', addrProv: 'BKK', hub: 'H001', slot: '13-14',
    inspector: 'INS01', passed: 40, failed: 0,
  }),
  buildInspected({
    requestDate: daysAgo(30), appointmentDate: daysAgo(23), inspectionDate: daysAgo(23),
    result: InspectionResult.Failed,
    customerName: 'นัฐพร เพชรงาม', mobile: '081-606-7878',
    carBrand: 'ISUZU', carModel: 'D-Max Spark', carYear: 2014, carColor: 'น้ำเงิน',
    plate: 'ฉฉ-4040', plateProv: 'CB', mileage: 175000,
    dealer: 'D001', addrProv: 'CB', hub: 'H002', slot: '15-16',
    inspector: 'INS04', passed: 22, failed: 8,
    remark: 'ระบบเบรกหลังต้องเปลี่ยน',
  }),
  buildInspected({
    requestDate: daysAgo(31), appointmentDate: daysAgo(24), inspectionDate: daysAgo(24),
    result: InspectionResult.Passed,
    customerName: 'อรรถพล ใจดี', mobile: '089-707-1414',
    carBrand: 'MITSUBISHI', carModel: 'Triton Athlete', carYear: 2020, carColor: 'ดำ',
    plate: 'ชช-5005', plateProv: 'PT', mileage: 67000,
    dealer: 'D001', addrProv: 'PT', hub: 'H003', slot: '10-11',
    inspector: 'INS02', passed: 39, failed: 1,
  }),
  buildInspected({
    requestDate: daysAgo(33), appointmentDate: daysAgo(26), inspectionDate: daysAgo(26),
    result: InspectionResult.Passed,
    customerName: 'พิมพ์ใจ ทองคำ', mobile: '062-101-3333',
    carBrand: 'BYD', carModel: 'Dolphin', carYear: 2023, carColor: 'ขาว',
    plate: 'ซซ-1212', plateProv: 'CM', mileage: 6800,
    dealer: 'D003', addrProv: 'CM', hub: 'H004', slot: '11-12',
    inspector: 'INS03', passed: 40, failed: 0,
  }),
  buildInspected({
    requestDate: daysAgo(35), appointmentDate: daysAgo(28), inspectionDate: daysAgo(28),
    result: InspectionResult.Failed,
    customerName: 'วิชาญ บูชา', mobile: '081-808-9090',
    carBrand: 'FORD', carModel: 'Everest', carYear: 2015, carColor: 'แดง',
    plate: 'ฌฌ-7700', plateProv: 'SP', mileage: 190000,
    dealer: 'D001', addrProv: 'SP', hub: 'H002', slot: '14-15',
    inspector: 'INS04', passed: 14, failed: 16,
    remark: 'หม้อน้ำรั่ว, ช่วงล่างหลวม, ระบบไฟฟ้ามีปัญหา',
  }),
];

// === Factory helpers ===

function buildRequest(p: {
  requestDate: Date;
  appointmentStatus: AppointmentStatus;
  customerName: string;
  mobile: string;
  carBrand: string; carModel: string; carYear: number; carColor: string;
  plate: string; plateProv: string; mileage: number;
  dealer: string; addrProv: string;
  remark?: string;
}): CiRequest {
  return {
    requestId: cryptoRandom(),
    requestFormNo: nextNo('CI'),
    referenceId: 'REF' + Math.floor(Math.random() * 90000 + 10000),
    requestDate: p.requestDate,
    appointmentStatus: p.appointmentStatus,
    meetingStatus: MeetingStatus.NotMet,
    inspectionStatus: InspectionStatus.Wait,
    inspectionResult: InspectionResult.Pending,
    carBrand: p.carBrand, carModel: p.carModel, carYear: p.carYear, carColor: p.carColor,
    licensePlate: p.plate, licenseProvince: p.plateProv, mileage: p.mileage,
    customerName: p.customerName, customerMobile: p.mobile,
    addressProvince: p.addrProv,
    dealerName: dealerLabel(p.dealer),
    appointmentDate: null, hubName: null, slotLabel: null,
    inspectionDate: null, inspectorName: null,
    remark: p.remark,
  };
}

function buildBooked(p: {
  requestDate: Date; appointmentDate: Date;
  meetingStatus: MeetingStatus; inspectionStatus: InspectionStatus;
  customerName: string; mobile: string;
  carBrand: string; carModel: string; carYear: number; carColor: string;
  plate: string; plateProv: string; mileage: number;
  dealer: string; addrProv: string;
  hub: string; slot: string;
}): CiRequest {
  const r = buildRequest({
    requestDate: p.requestDate, appointmentStatus: AppointmentStatus.Booked,
    customerName: p.customerName, mobile: p.mobile,
    carBrand: p.carBrand, carModel: p.carModel, carYear: p.carYear, carColor: p.carColor,
    plate: p.plate, plateProv: p.plateProv, mileage: p.mileage,
    dealer: p.dealer, addrProv: p.addrProv,
  });
  r.appointmentDate = p.appointmentDate;
  r.meetingStatus = p.meetingStatus;
  r.inspectionStatus = p.inspectionStatus;
  r.hubName = hubLabel(p.hub);
  r.slotLabel = slotLabel(p.slot);
  return r;
}

function buildInspected(p: {
  requestDate: Date; appointmentDate: Date; inspectionDate: Date;
  result: InspectionResult;
  customerName: string; mobile: string;
  carBrand: string; carModel: string; carYear: number; carColor: string;
  plate: string; plateProv: string; mileage: number;
  dealer: string; addrProv: string;
  hub: string; slot: string;
  inspector: string; passed: number; failed: number;
  remark?: string;
}): CiRequest {
  const r = buildBooked({
    requestDate: p.requestDate, appointmentDate: p.appointmentDate,
    meetingStatus: MeetingStatus.Met, inspectionStatus: InspectionStatus.Done,
    customerName: p.customerName, mobile: p.mobile,
    carBrand: p.carBrand, carModel: p.carModel, carYear: p.carYear, carColor: p.carColor,
    plate: p.plate, plateProv: p.plateProv, mileage: p.mileage,
    dealer: p.dealer, addrProv: p.addrProv,
    hub: p.hub, slot: p.slot,
  });
  r.inspectionDate = p.inspectionDate;
  r.inspectionResult = p.result;
  r.inspectorName = inspectorLabel(p.inspector);
  r.passedItems = p.passed;
  r.failedItems = p.failed;
  r.resultRemark = p.remark;
  return r;
}

function dealerLabel(code: string)    { return DEALERS.find(d => d.value === code)?.label    ?? code; }
function hubLabel(code: string)       { return HUBS.find(h => h.value === code)?.label       ?? code; }
function slotLabel(code: string)      { return SLOTS.find(s => s.value === code)?.label      ?? code; }
function inspectorLabel(code: string) { return INSPECTORS.find(i => i.value === code)?.label ?? code; }

function cryptoRandom(): string {
  // Browser-friendly UUIDish; we don't need real UUID for an in-memory mock.
  return 'r-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function newRequestId(): string { return cryptoRandom(); }
export function nextRequestFormNo(): string { return nextNo('CI'); }
