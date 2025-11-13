import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boleta, BoletaRequest } from '../models/Boleta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  private apiUrl = environment.apiUrl + '/boletas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const dni = localStorage.getItem('dni');
    return new HttpHeaders({
      'X-DNI': dni || ''
    });
  }

  listAll(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(this.apiUrl);
  }

  getById(id: number): Observable<Boleta> {
    return this.http.get<Boleta>(`${this.apiUrl}/${id}`);
  }

  create(request: BoletaRequest): Observable<Boleta> {
    return this.http.post<Boleta>(this.apiUrl, request, {
      headers: this.getHeaders()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  markPaid(id: number): Observable<Boleta> {
    return this.http.post<Boleta>(`${this.apiUrl}/${id}/pagada`, {});
  }

  listPendientes(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/pendientes`);
  }

  listPagadas(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/pagadas`);
  }

  listByEncargado(dniEncargado: string): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/encargado/${dniEncargado}`);
  }

  listByCliente(dniCliente: string): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/cliente/${dniCliente}`);
  }
}