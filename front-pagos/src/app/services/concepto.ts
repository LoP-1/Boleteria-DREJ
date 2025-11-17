// Importaciones necesarias para el servicio
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concepto } from '../models/Concepto';
import { environment } from '../../environments/environment';

// Servicio para manejar operaciones con conceptos
@Injectable({
  providedIn: 'root'
})
export class ConceptoService {
  // URL base de la API para conceptos
  private apiUrl = environment.apiUrl + '/conceptos';

  // Constructor inyecta HttpClient
  constructor(private http: HttpClient) {}

  // Lista todos los conceptos
  listAll(): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(this.apiUrl);
  }

  // Obtiene un concepto por ID
  getById(id: number): Observable<Concepto> {
    return this.http.get<Concepto>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo concepto
  create(concepto: Concepto): Observable<Concepto> {
    return this.http.post<Concepto>(this.apiUrl, concepto);
  }

  // Actualiza un concepto existente
  update(id: number, concepto: Concepto): Observable<Concepto> {
    return this.http.put<Concepto>(`${this.apiUrl}/${id}`, concepto);
  }

  // Elimina un concepto por ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}