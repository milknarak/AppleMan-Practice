import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AppointmentStatus, InspectionResult, InspectionStatus, MeetingStatus } from '../ci/ci.model';
import { ciMockStore } from './ci-mock-store';

/**
 * Intercepts `/api/ci/*` and serves responses from `ciMockStore` instead of
 * making an HTTP call. This is how the deployed static build works without
 * an Express BE — the FE talks to itself.
 *
 * When `environment.useMockBackend` is false (dev mode), this interceptor is
 * not registered, so requests fall through to the proxy → Express BE.
 */
const LATENCY_MS = 80;

export function mockBackendInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const handled = dispatch(req);
  if (!handled) return next(req);
  return handled.pipe(delay(LATENCY_MS));
}

function dispatch(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> | null {
  const url = stripOrigin(req.urlWithParams);
  const path = stripOrigin(req.url);
  const method = req.method.toUpperCase();
  const body = (req.body ?? {}) as Record<string, unknown>;

  // === Master ===
  if (method === 'GET' && path === '/api/ci/master') {
    return ok(ciMockStore.getMaster());
  }

  // === cidt01 ===
  if (method === 'GET' && path === '/api/ci/cidt01') {
    const q = parseQuery(url);
    const result = ciMockStore.cidt01Search(num(q['page'], 1), num(q['pageSize'], 10), {
      requestDateFrom:   parseDate(q['requestDateFrom']),
      requestDateTo:     parseDate(q['requestDateTo']),
      carBrand:          q['carBrand'] ?? null,
      appointmentStatus: q['appointmentStatus'] ?? null,
      keyword:           q['keyword'] ?? null,
    });
    return ok(result);
  }
  if (method === 'GET' && path === '/api/ci/cidt01/summary') {
    return ok(ciMockStore.cidt01Summary());
  }
  if (method === 'POST' && path === '/api/ci/cidt01/book') {
    const { requestId, appointmentDate, hubCode, slotCode } = body as Record<string, string>;
    if (!requestId || !appointmentDate || !hubCode || !slotCode) return bad('missing fields');
    const updated = ciMockStore.bookAppointment(requestId, new Date(appointmentDate), hubCode, slotCode);
    return updated ? ok(updated) : notFound();
  }

  // === cidt02 ===
  if (method === 'GET' && path === '/api/ci/cidt02') {
    const q = parseQuery(url);
    return ok(ciMockStore.cidt02Search(num(q['page'], 1), num(q['pageSize'], 10), {
      appointmentDateFrom: parseDate(q['appointmentDateFrom']),
      appointmentDateTo:   parseDate(q['appointmentDateTo']),
      hub:                 q['hub'] ?? null,
      meetingStatus:       (q['meetingStatus'] as MeetingStatus | undefined) ?? null,
      keyword:             q['keyword'] ?? null,
    }));
  }
  if (method === 'GET' && path === '/api/ci/cidt02/summary') {
    return ok(ciMockStore.cidt02Summary());
  }
  if (method === 'POST' && path === '/api/ci/cidt02/mark-met') {
    const { requestId } = body as Record<string, string>;
    if (!requestId) return bad('missing requestId');
    const updated = ciMockStore.markMet(requestId);
    return updated ? ok(updated) : notFound();
  }

  // === cidt03 ===
  if (method === 'GET' && path === '/api/ci/cidt03') {
    const q = parseQuery(url);
    return ok(ciMockStore.cidt03Search(num(q['page'], 1), num(q['pageSize'], 10), {
      inspectionDateFrom: parseDate(q['inspectionDateFrom']),
      inspectionDateTo:   parseDate(q['inspectionDateTo']),
      inspector:          q['inspector'] ?? null,
      inspectionResult:   (q['inspectionResult'] as InspectionResult | undefined) ?? null,
      keyword:            q['keyword'] ?? null,
    }));
  }
  if (method === 'GET' && path === '/api/ci/cidt03/summary') {
    return ok(ciMockStore.cidt03Summary());
  }
  if (method === 'POST' && path === '/api/ci/cidt03/save-result') {
    const { requestId, result, inspectorCode, passed, failed, remark } = body as Record<string, unknown>;
    if (!requestId || !result || !inspectorCode) return bad('missing fields');
    const updated = ciMockStore.saveInspectionResult(
      String(requestId), result as InspectionResult, String(inspectorCode),
      Number(passed ?? 0), Number(failed ?? 0), String(remark ?? ''));
    return updated ? ok(updated) : notFound();
  }

  // === Detail + Customer self-service ===
  const requestMatch = path.match(/^\/api\/ci\/request\/([^/]+)$/);
  if (method === 'GET' && requestMatch) {
    const found = ciMockStore.getRequest(decodeURIComponent(requestMatch[1]!));
    return found ? ok(found) : notFound();
  }
  if (method === 'POST' && path === '/api/ci/request') {
    const p = body as Record<string, unknown>;
    const required = ['customerName', 'customerMobile', 'carBrand', 'carModel', 'licensePlate'];
    for (const k of required) {
      if (!p[k]) return bad(`missing ${k}`);
    }
    const out = ciMockStore.submitCustomerRequest(p as never);
    return ok(out, 201);
  }

  return null;
}

// === Response helpers ===

function ok<T>(body: T, status = 200): Observable<HttpEvent<unknown>> {
  return of(new HttpResponse({ body, status }));
}
function bad(error: string): Observable<HttpEvent<unknown>> {
  return throwError(() => ({ status: 400, error: { error } }));
}
function notFound(): Observable<HttpEvent<unknown>> {
  return throwError(() => ({ status: 404, error: { error: 'not found' } }));
}

// === Parse helpers ===

function stripOrigin(u: string): string {
  // urlWithParams can be either `/api/...` or absolute `http://host/api/...`
  return u.replace(/^https?:\/\/[^/]+/, '');
}
function parseQuery(url: string): Record<string, string> {
  const q: Record<string, string> = {};
  const idx = url.indexOf('?');
  if (idx < 0) return q;
  for (const part of url.slice(idx + 1).split('&')) {
    const [k, v] = part.split('=');
    if (k) q[decodeURIComponent(k)] = decodeURIComponent(v ?? '');
  }
  return q;
}
function num(v: string | undefined, dflt: number): number {
  if (v == null || v === '') return dflt;
  const n = Number(v);
  return isNaN(n) ? dflt : n;
}
function parseDate(v: string | undefined): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(+d) ? null : d;
}

// Silence "unused" hint for the enum imports — referenced via casts above
void AppointmentStatus; void InspectionStatus;
