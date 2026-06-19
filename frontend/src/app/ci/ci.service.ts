import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  Cidt01Query, Cidt01Summary, Cidt02Query, Cidt02Summary,
  Cidt03Query, Cidt03Summary, CiMaster, CiRequest, CustomerRequestPayload,
  InspectionResult, PageRequest, PageResult,
} from './ci.model';

/**
 * Thin HTTP client for the BE. proxy.conf.json forwards `/api/*` to the Express
 * dev server on :3000 during dev, so we use relative paths. In prod, the same
 * paths work if the BE is reverse-proxied under the same origin.
 */
@Injectable({ providedIn: 'root' })
export class CiService {
  private http = inject(HttpClient);
  private readonly base = '/api/ci';

  getMaster(): Observable<CiMaster> {
    return this.http.get<CiMaster>(`${this.base}/master`);
  }

  // === cidt01 ===

  cidt01Search(page: PageRequest, q: Cidt01Query): Observable<PageResult<CiRequest>> {
    return this.http.get<PageResult<CiRequest>>(`${this.base}/cidt01`, {
      params: this.buildParams({ ...page, ...q }),
    }).pipe(map(r => ({ ...r, items: r.items.map(reviveDates) })));
  }

  cidt01Summary(): Observable<Cidt01Summary> {
    return this.http.get<Cidt01Summary>(`${this.base}/cidt01/summary`);
  }

  bookAppointment(requestId: string, appointmentDate: Date, hubCode: string, slotCode: string): Observable<void> {
    return this.http.post<CiRequest>(`${this.base}/cidt01/book`, {
      requestId, appointmentDate: appointmentDate.toISOString(), hubCode, slotCode,
    }).pipe(map(() => void 0));
  }

  // === cidt02 ===

  cidt02Search(page: PageRequest, q: Cidt02Query): Observable<PageResult<CiRequest>> {
    return this.http.get<PageResult<CiRequest>>(`${this.base}/cidt02`, {
      params: this.buildParams({ ...page, ...q }),
    }).pipe(map(r => ({ ...r, items: r.items.map(reviveDates) })));
  }

  cidt02Summary(): Observable<Cidt02Summary> {
    return this.http.get<Cidt02Summary>(`${this.base}/cidt02/summary`);
  }

  markMet(requestId: string): Observable<void> {
    return this.http.post<CiRequest>(`${this.base}/cidt02/mark-met`, { requestId })
      .pipe(map(() => void 0));
  }

  // === cidt03 ===

  cidt03Search(page: PageRequest, q: Cidt03Query): Observable<PageResult<CiRequest>> {
    return this.http.get<PageResult<CiRequest>>(`${this.base}/cidt03`, {
      params: this.buildParams({ ...page, ...q }),
    }).pipe(map(r => ({ ...r, items: r.items.map(reviveDates) })));
  }

  cidt03Summary(): Observable<Cidt03Summary> {
    return this.http.get<Cidt03Summary>(`${this.base}/cidt03/summary`);
  }

  saveInspectionResult(requestId: string, result: InspectionResult, inspectorCode: string,
                       passed: number, failed: number, remark: string): Observable<void> {
    return this.http.post<CiRequest>(`${this.base}/cidt03/save-result`, {
      requestId, result, inspectorCode, passed, failed, remark,
    }).pipe(map(() => void 0));
  }

  // === Detail ===

  getRequest(requestId: string): Observable<CiRequest | undefined> {
    return this.http.get<CiRequest>(`${this.base}/request/${encodeURIComponent(requestId)}`)
      .pipe(map(r => reviveDates(r)));
  }

  // === Customer ===

  submitCustomerRequest(payload: CustomerRequestPayload): Observable<{ requestFormNo: string }> {
    return this.http.post<{ requestFormNo: string }>(`${this.base}/request`, payload);
  }

  // === Helpers ===

  private buildParams(obj: Record<string, unknown>): HttpParams {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(obj)) {
      if (v == null || v === '') continue;
      if (v instanceof Date) params = params.set(k, v.toISOString());
      else params = params.set(k, String(v));
    }
    return params;
  }
}

const DATE_FIELDS: (keyof CiRequest)[] = ['requestDate', 'appointmentDate', 'inspectionDate'];

function reviveDates(r: CiRequest): CiRequest {
  const out: CiRequest = { ...r };
  for (const f of DATE_FIELDS) {
    const v = out[f];
    if (typeof v === 'string') (out as unknown as Record<string, unknown>)[f] = new Date(v);
  }
  return out;
}
