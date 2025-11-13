import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Concepto } from '../models/Concepto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {
  private apiUrl = environment.apiUrl + '/conceptos';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Concepto> {
    return this.http.get<Concepto>(`${this.apiUrl}/${id}`);
  }

  create(concepto: Concepto): Observable<Concepto> {
    return this.http.post<Concepto>(this.apiUrl, concepto);
  }

  update(id: number, concepto: Concepto): Observable<Concepto> {
    return this.http.put<Concepto>(`${this.apiUrl}/${id}`, concepto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}