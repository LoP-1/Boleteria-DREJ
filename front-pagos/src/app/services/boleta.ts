import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Boleta, BoletaRequest } from '../models/Boleta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  private apiUrl = environment.apiUrl + '/boletas';

  private boletaCreada$ = new Subject<void>();
  private boletaPagada$ = new Subject<void>();
  private boletaEliminada$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Observables publicos para que los componentes se suscriban
  get onBoletaCreada(): Observable<void> {
    return this.boletaCreada$.asObservable();
  }

  get onBoletaPagada(): Observable<void> {
    return this.boletaPagada$.asObservable();
  }

  get onBoletaEliminada(): Observable<void> {
    return this.boletaEliminada$.asObservable();
  }

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
    }).pipe(
      tap(() => {
        this.boletaCreada$.next();
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.boletaEliminada$.next();
      })
    );
  }

  markPaid(id: number): Observable<Boleta> {
    return this.http.post<Boleta>(`${this.apiUrl}/${id}/pagada`, {}).pipe(
      tap(() => {
        this.boletaPagada$.next();
      })
    );
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