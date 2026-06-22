# Practice

Demo version ของ **Car Inspection Management System** สำหรับใส่ portfolio — เน้นแสดง flow การจัดการคำขอตรวจสภาพรถจากฝั่งหลังบ้าน (CIDT01/02/03) + หน้าบ้านลูกค้ายื่นคำขอ

Architecture เดียวกับเว็บลูกค้าจริง (Angular FE → Express BE) แต่ **ไม่มี DB** — ข้อมูลทั้งหมดเป็น mock array ใน memory ที่ฝั่ง BE (restart BE = reset)

> โปรเจคจริงของลูกค้าเป็น confidential เอามาแสดงไม่ได้ — โปรเจคนี้ port เฉพาะ scope CIDT01/02/03 พร้อม simplify field ลงเหลือเฉพาะที่จำเป็นต่อ demo

## Stack

- **Frontend** — Angular 21 (standalone), Bootstrap 5, FontAwesome 7, RxJS + Signals
- **Backend** — Node 22 + Express 4 + TypeScript (ESM), tsx watch
- **Data** — In-memory mock array ที่ฝั่ง BE
- **Dev tools** — concurrently (รัน FE+BE พร้อมกัน command เดียว)

## โครงสร้าง

```
Practice/
├── backend/                         (Express + TS, port 3000)
│   ├── src/
│   │   ├── index.ts                 (Express bootstrap + CORS + 404/error handler)
│   │   ├── data/ci-mock-data.ts     (master + 24 seed requests)
│   │   ├── routes/ci.routes.ts      (REST endpoints, query parsing, validation)
│   │   ├── services/ci.service.ts   (business logic: filter/paginate/state)
│   │   └── types/ci.types.ts        (shared enums + interfaces)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                        (Angular standalone, port 4200)
│   ├── src/app/
│   │   ├── app.config.ts            (providers + HttpClient)
│   │   ├── app.routes.ts            (router: /backoffice/* + /request)
│   │   ├── ci/
│   │   │   ├── ci.model.ts          (FE-side types, mirror of BE)
│   │   │   ├── ci.service.ts        (HttpClient wrapper)
│   │   │   ├── cidt01-list.*        (รายการรอนัดหมาย + booking modal)
│   │   │   ├── cidt02-list.*        (รายการนัดหมาย + mark-met action)
│   │   │   ├── cidt03-list.*        (ผลตรวจ + save-result modal)
│   │   │   └── customer-request.*   (หน้าบ้าน: ฟอร์มขอตรวจสภาพ)
│   │   └── shared/
│   │       ├── backoffice-shell.component.ts   (sidebar + topbar layout)
│   │       ├── status-badge.component.ts       (status pill)
│   │       ├── kpi-card.component.ts           (KPI summary card)
│   │       ├── snackbar.*                      (toast notification)
│   │       └── thaidate.pipe.ts                (dd MMM yy พ.ศ.)
│   ├── proxy.conf.json              (/api/* → http://localhost:3000)
│   ├── angular.json
│   └── package.json
└── package.json                     (root: concurrently scripts)
```

## รันโปรเจค

### ครั้งแรก — ติดตั้ง dependencies

```bash
npm run install:all
```

(หรือเข้าทีละโฟลเดอร์: `npm install` ที่ root, ที่ `backend/`, และที่ `frontend/`)

### Dev mode — รัน FE+BE พร้อมกัน

```bash
npm run dev
```

- BE listening at `http://localhost:3000`
- FE listening at `http://localhost:4200`
- FE proxy forwards `/api/*` → BE (no CORS issues in dev)

Log ของ BE+FE จะ stream มาด้วยกันใน terminal เดียว (color-coded ผ่าน concurrently)

### หรือรันแยก

```bash
# terminal 1
npm run start:be          # → http://localhost:3000

# terminal 2
npm run start:fe          # → http://localhost:4200
```

### Production build

```bash
npm run build             # build ทั้ง BE และ FE
npm run build:fe          # FE only → frontend/dist/appleman-practice
npm run build:be          # BE only → backend/dist
```

## หน้าจอที่มี

| Route | คำอธิบาย |
|---|---|
| `/backoffice/cidt01` | **CIDT01** — รายการคำขอที่รอนัดหมาย + KPI cards (รอนัด/นัดวันนี้/ยกเลิก/ทั้งหมด) + filter + booking modal |
| `/backoffice/cidt02` | **CIDT02** — รายการนัดหมาย + KPI (นัดที่จะมา/พบลูกค้าแล้ว/รอตรวจ) + mark-met action |
| `/backoffice/cidt03` | **CIDT03** — ผลตรวจ + KPI (ผ่าน/ไม่ผ่าน/รอสรุป) + save-result modal |
| `/request` | **หน้าบ้าน** — ฟอร์มขอตรวจสภาพรถสำหรับลูกค้า → POST `/api/ci/request` → returns เลขที่คำขอ |

## REST API endpoints (BE)

| Method | Path | คำอธิบาย |
|---|---|---|
| GET  | `/health` | health check |
| GET  | `/api/ci/master` | master data (provinces, brands, hubs, slots, inspectors, status options) |
| GET  | `/api/ci/cidt01?page&pageSize&...` | list with filter + pagination |
| GET  | `/api/ci/cidt01/summary` | KPI counts |
| POST | `/api/ci/cidt01/book` | นัดหมาย → `{ requestId, appointmentDate, hubCode, slotCode }` |
| GET  | `/api/ci/cidt02?page&pageSize&...` | list (booked, not done yet) |
| GET  | `/api/ci/cidt02/summary` | KPI counts |
| POST | `/api/ci/cidt02/mark-met` | บันทึกพบลูกค้า → `{ requestId }` |
| GET  | `/api/ci/cidt03?page&pageSize&...` | list (in-progress + done) |
| GET  | `/api/ci/cidt03/summary` | KPI counts |
| POST | `/api/ci/cidt03/save-result` | บันทึกผลตรวจ → `{ requestId, result, inspectorCode, passed, failed, remark }` |
| GET  | `/api/ci/request/:id` | get one request |
| POST | `/api/ci/request` | customer self-service: ยื่นคำขอใหม่ |

ทุก endpoint มี artificial latency 120ms (จำลอง network delay)

## CI Lifecycle (state machine)

```
                                                        ┌─────────────────┐
                                                        │ inspectionResult │
                                                        │  P → Y (ผ่าน)     │
                                                        │  P → N (ไม่ผ่าน)   │
                                                        └─────────▲────────┘
                                                                  │
                                                                  │ save-result
                                                                  │ (CIDT03)
  ┌──────────┐  customer        ┌─────────┐  bookAppointment   ┌──────────┐  mark-met       ┌────────────┐
  │ submit   │  request         │ Pending │   (CIDT01)         │ Booked   │   (CIDT02)      │ InProgress │
  │ (หน้าบ้าน) │ ──────────────→ │ appoint │ ─────────────────→ │  + slot  │ ──────────────→ │            │
  └──────────┘                  └─────────┘                    └──────────┘                 └────────────┘
                                                                                                  │
                                                                                                  │ save-result
                                                                                                  ▼
                                                                                             ┌──────────┐
                                                                                             │   Done   │
                                                                                             └──────────┘
```

## Mock mode (FE-only) สำหรับ deploy เป็น static site

Production build จะเปิด **mock-backend interceptor** อัตโนมัติ — FE จะรันได้ทันทีโดย**ไม่ต้องมี BE** เพราะมี mock store + business logic ทั้งหมด bundled อยู่ในตัว ([`frontend/src/app/mock/`](frontend/src/app/mock/))

- ตอน `npm start` (dev) — `environment.useMockBackend = false` → ยิงผ่าน proxy.conf.json ไปที่ BE Express จริง
- ตอน `ng build` (prod) — fileReplacement สลับเป็น `environment.production.ts` ที่ `useMockBackend = true` → interceptor ดักทุก `/api/*` แล้วตอบจาก in-memory store
- ทั้ง 2 mode ใช้ `ci.service.ts` ตัวเดียวกัน — แค่เปลี่ยน data source ระดับ HTTP layer

ผลคือ:
- `dist/appleman-practice/browser/` deploy เป็น static site ได้เลย (GitHub Pages / Vercel / Netlify)
- ผู้เปิด demo เห็นหน้าจอทำงานครบทันที (refresh = reset เป็น seed data)
- โค้ด BE ใน `backend/` ยังอยู่เป็น "reference architecture" — แสดงว่าโปรเจคจริงรันแบบ FE↔BE ได้

### Deploy ขึ้น GitHub Pages

```bash
npm run build:fe                                            # → frontend/dist/appleman-practice/browser/
# เผื่อ base href ของ repo เป็น sub-path:
cd frontend && npx ng build --base-href "/AppleMan-Practice/"
```

ลง GitHub Pages ได้ผ่าน `gh-pages` หรือ GitHub Actions workflow (publish folder = `frontend/dist/appleman-practice/browser`)

### Deploy ขึ้น Vercel

`vercel.json` ที่ root ของ frontend:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/appleman-practice/browser",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

แล้ว `vercel --prod` หรือ connect GitHub repo ใน Vercel dashboard

## ข้อจำกัด

- **ไม่มี DB** — restart BE = reset ข้อมูล
- **ไม่มี auth** — ทุก request เข้าได้หมด (ของจริงมี JWT + role-based guard ที่ Angular routes)
- **ไม่มี translate** — UI ทั้งหมด hardcode ภาษาไทย (ของจริงใช้ ngx-translate)
- **ไม่มี toastr** — ใช้ snackbar เองแบบเบาๆ (ของจริงใช้ ngx-toastr)
- **simplified model** — `CiRequest` ของจริงมี 70+ field, demo เก็บเฉพาะ 25+ field ที่จำเป็นต่อ scope CIDT01/02/03
