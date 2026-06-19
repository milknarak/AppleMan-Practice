import { Router } from 'express';

import { ciService } from '../services/ci.service.js';
import { InspectionResult } from '../types/ci.types.js';

export const ciRouter = Router();

const LATENCY_MS = 120;
const withLatency = <T>(fn: () => T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(fn()), LATENCY_MS));

// === Master ===

ciRouter.get('/master', async (_req, res) => {
  res.json(await withLatency(() => ciService.getMaster()));
});

// === cidt01 ===

ciRouter.get('/cidt01', async (req, res) => {
  const page = Number(req.query['page'] ?? 1);
  const pageSize = Number(req.query['pageSize'] ?? 10);
  const result = await withLatency(() => ciService.cidt01Search(page, pageSize, {
    requestDateFrom:   parseDate(req.query['requestDateFrom']),
    requestDateTo:     parseDate(req.query['requestDateTo']),
    carBrand:          str(req.query['carBrand']),
    appointmentStatus: str(req.query['appointmentStatus']),
    keyword:           str(req.query['keyword']),
  }));
  res.json(result);
});

ciRouter.get('/cidt01/summary', async (_req, res) => {
  res.json(await withLatency(() => ciService.cidt01Summary()));
});

ciRouter.post('/cidt01/book', async (req, res) => {
  const { requestId, appointmentDate, hubCode, slotCode } = req.body ?? {};
  if (!requestId || !appointmentDate || !hubCode || !slotCode) {
    res.status(400).json({ error: 'missing fields' });
    return;
  }
  const updated = await withLatency(() =>
    ciService.bookAppointment(requestId, new Date(appointmentDate), hubCode, slotCode));
  if (!updated) { res.status(404).json({ error: 'not found' }); return; }
  res.json(updated);
});

// === cidt02 ===

ciRouter.get('/cidt02', async (req, res) => {
  const page = Number(req.query['page'] ?? 1);
  const pageSize = Number(req.query['pageSize'] ?? 10);
  const result = await withLatency(() => ciService.cidt02Search(page, pageSize, {
    appointmentDateFrom: parseDate(req.query['appointmentDateFrom']),
    appointmentDateTo:   parseDate(req.query['appointmentDateTo']),
    hub:                 str(req.query['hub']),
    meetingStatus:       str(req.query['meetingStatus']),
    keyword:             str(req.query['keyword']),
  }));
  res.json(result);
});

ciRouter.get('/cidt02/summary', async (_req, res) => {
  res.json(await withLatency(() => ciService.cidt02Summary()));
});

ciRouter.post('/cidt02/mark-met', async (req, res) => {
  const { requestId } = req.body ?? {};
  if (!requestId) { res.status(400).json({ error: 'missing requestId' }); return; }
  const updated = await withLatency(() => ciService.markMet(requestId));
  if (!updated) { res.status(404).json({ error: 'not found' }); return; }
  res.json(updated);
});

// === cidt03 ===

ciRouter.get('/cidt03', async (req, res) => {
  const page = Number(req.query['page'] ?? 1);
  const pageSize = Number(req.query['pageSize'] ?? 10);
  const result = await withLatency(() => ciService.cidt03Search(page, pageSize, {
    inspectionDateFrom: parseDate(req.query['inspectionDateFrom']),
    inspectionDateTo:   parseDate(req.query['inspectionDateTo']),
    inspector:          str(req.query['inspector']),
    inspectionResult:   str(req.query['inspectionResult']),
    keyword:            str(req.query['keyword']),
  }));
  res.json(result);
});

ciRouter.get('/cidt03/summary', async (_req, res) => {
  res.json(await withLatency(() => ciService.cidt03Summary()));
});

ciRouter.post('/cidt03/save-result', async (req, res) => {
  const { requestId, result, inspectorCode, passed, failed, remark } = req.body ?? {};
  if (!requestId || !result || !inspectorCode) {
    res.status(400).json({ error: 'missing fields' });
    return;
  }
  const validResults: InspectionResult[] = [
    InspectionResult.Pending, InspectionResult.Passed, InspectionResult.Failed,
  ];
  if (!validResults.includes(result)) {
    res.status(400).json({ error: 'invalid result' });
    return;
  }
  const updated = await withLatency(() => ciService.saveInspectionResult(
    requestId, result, inspectorCode, Number(passed ?? 0), Number(failed ?? 0), remark ?? ''));
  if (!updated) { res.status(404).json({ error: 'not found' }); return; }
  res.json(updated);
});

// === Detail ===

ciRouter.get('/request/:id', async (req, res) => {
  const found = await withLatency(() => ciService.getRequest(req.params['id']));
  if (!found) { res.status(404).json({ error: 'not found' }); return; }
  res.json(found);
});

// === Customer ===

ciRouter.post('/request', async (req, res) => {
  const p = req.body ?? {};
  const required = ['customerName', 'customerMobile', 'carBrand', 'carModel', 'licensePlate'];
  for (const k of required) {
    if (!p[k]) { res.status(400).json({ error: `missing ${k}` }); return; }
  }
  const out = await withLatency(() => ciService.submitCustomerRequest(p));
  res.status(201).json(out);
});

// === Helpers ===

function str(v: unknown): string | null {
  if (typeof v === 'string' && v.length > 0) return v;
  return null;
}
function parseDate(v: unknown): Date | null {
  if (typeof v !== 'string' || v.length === 0) return null;
  const d = new Date(v);
  return isNaN(+d) ? null : d;
}
