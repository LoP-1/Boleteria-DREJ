// Importaciones necesarias para el servicio
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Boleta, BoletaRequest } from '../models/Boleta';
import { environment } from '../../environments/environment';

// Servicio para manejar operaciones con boletas
@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  // URL base de la API para boletas
  private apiUrl = environment.apiUrl + '/boletas';

  // Subjects para emitir eventos cuando se crean, pagan o eliminan boletas
  private boletaCreada$ = new Subject<void>();
  private boletaPagada$ = new Subject<void>();
  private boletaEliminada$ = new Subject<void>();

  // Constructor inyecta HttpClient
  constructor(private http: HttpClient) {}

  // Observables públicos para suscribirse a eventos
  get onBoletaCreada(): Observable<void> {
    return this.boletaCreada$.asObservable();
  }

  get onBoletaPagada(): Observable<void> {
    return this.boletaPagada$.asObservable();
  }

  get onBoletaEliminada(): Observable<void> {
    return this.boletaEliminada$.asObservable();
  }

  // Genera headers con el DNI del usuario para autenticación
  private getHeaders(): HttpHeaders {
    const dni = localStorage.getItem('dni');
    return new HttpHeaders({
      'X-DNI': dni || ''
    });
  }

  // Lista todas las boletas
  listAll(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(this.apiUrl);
  }

  // Obtiene una boleta por ID
  getById(id: number): Observable<Boleta> {
    return this.http.get<Boleta>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva boleta
  create(request: BoletaRequest): Observable<Boleta> {
    return this.http.post<Boleta>(this.apiUrl, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        this.boletaCreada$.next();
      })
    );
  }

  // Elimina una boleta por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.boletaEliminada$.next();
      })
    );
  }

  // Marca una boleta como pagada
  markPaid(id: number): Observable<Boleta> {
    return this.http.post<Boleta>(`${this.apiUrl}/${id}/pagada`, {}).pipe(
      tap(() => {
        this.boletaPagada$.next();
      })
    );
  }

  // Lista boletas pendientes
  listPendientes(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/pendientes`);
  }

  // Lista boletas pagadas
  listPagadas(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/pagadas`);
  }

  // Lista boletas por encargado (DNI)
  listByEncargado(dniEncargado: string): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/encargado/${dniEncargado}`);
  }

  // Lista boletas por cliente (DNI)
  listByCliente(dniCliente: string): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.apiUrl}/cliente/${dniCliente}`);
  }
}