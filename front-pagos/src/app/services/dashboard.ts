import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DashboardQueryParams, DashboardSummary, TimeSeriesPoint, TopConcept } from '../models/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private formatDateParam(d?: Date | string | null): string | null {
    if (!d) return null;
    if (typeof d === 'string') return d;
    return d.toISOString().slice(0, 10);
  }

  getSummary(params: DashboardQueryParams = {}): Observable<DashboardSummary> {
    let httpParams = new HttpParams();
    const dFrom = this.formatDateParam(params.dateFrom);
    const dTo = this.formatDateParam(params.dateTo);
    if (dFrom) httpParams = httpParams.set('dateFrom', dFrom);
    if (dTo) httpParams = httpParams.set('dateTo', dTo);
    if (params.unidadCompetente) httpParams = httpParams.set('unidadCompetente', params.unidadCompetente);

    return this.http.get<DashboardSummary>(`${this.baseUrl}/api/dashboard/summary`, { params: httpParams });
  }

  getRevenue(params: DashboardQueryParams = {}): Observable<TimeSeriesPoint[]> {
    let httpParams = new HttpParams();
    const dFrom = this.formatDateParam(params.dateFrom);
    const dTo = this.formatDateParam(params.dateTo);
    if (dFrom) httpParams = httpParams.set('dateFrom', dFrom);
    if (dTo) httpParams = httpParams.set('dateTo', dTo);

    return this.http.get<TimeSeriesPoint[]>(`${this.baseUrl}/api/dashboard/revenue`, { params: httpParams })
      .pipe(
        map(list => list.map(p => ({ period: p.period, total: Number(p.total) })))
      );
  }

  getTopConcepts(params: DashboardQueryParams = {}): Observable<TopConcept[]> {
    let httpParams = new HttpParams();
    const dFrom = this.formatDateParam(params.dateFrom);
    const dTo = this.formatDateParam(params.dateTo);
    if (dFrom) httpParams = httpParams.set('dateFrom', dFrom);
    if (dTo) httpParams = httpParams.set('dateTo', dTo);
    if (params.limit != null) httpParams = httpParams.set('limit', String(params.limit));
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);

    return this.http.get<TopConcept[]>(`${this.baseUrl}/api/dashboard/top-concepts`, { params: httpParams })
      .pipe(map(list => list.map(c => ({
        conceptoId: Number(c.conceptoId),
        nombre: c.nombre,
        cantidad: Number(c.cantidad),
        monto: Number(c.monto)
      }))));
  }

  exportVentasPorDia(dateFrom?: Date | string, dateTo?: Date | string, format: string = 'excel'): Observable<Blob> {
  let httpParams = new HttpParams();
  const dFrom = this.formatDateParam(dateFrom);
  const dTo = this.formatDateParam(dateTo);
  if (dFrom) httpParams = httpParams.set('dateFrom', dFrom);
  if (dTo) httpParams = httpParams.set('dateTo', dTo);
  httpParams = httpParams.set('format', format);

  return this.http.get(`${this.baseUrl}/api/dashboard/export/ventas-por-dia`, 
    { params: httpParams, responseType: 'blob' as 'json' }) as Observable<Blob>;
}

exportBoletasDetalladas(dateFrom?: Date | string, dateTo?: Date | string, format: string = 'excel'): Observable<Blob> {
  let httpParams = new HttpParams();
  const dFrom = this.formatDateParam(dateFrom);
  const dTo = this.formatDateParam(dateTo);
  if (dFrom) httpParams = httpParams.set('dateFrom', dFrom);
  if (dTo) httpParams = httpParams.set('dateTo', dTo);
  httpParams = httpParams.set('format', format);

  return this.http.get(`${this.baseUrl}/api/dashboard/export/boletas-detalladas`, 
    { params: httpParams, responseType: 'blob' as 'json' }) as Observable<Blob>;
}
}