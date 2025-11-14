import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, RegisterUsuarioRequest, EditUsuarioRequest } from '../models/Usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  register(request: RegisterUsuarioRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getByDni(dni: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${dni}`);
  }

  edit(dni: string, request: EditUsuarioRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dni}`, request);
  }

  delete(dni: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${dni}`);
  }
}