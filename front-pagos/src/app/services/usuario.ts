// Importaciones necesarias para el servicio
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, RegisterUsuarioRequest, EditUsuarioRequest } from '../models/Usuario';
import { environment } from '../../environments/environment';

// Servicio para manejar operaciones con usuarios
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // URL base de la API para usuarios
  private apiUrl = environment.apiUrl + '/usuarios';

  // Constructor inyecta HttpClient
  constructor(private http: HttpClient) {}

  // Registra un nuevo usuario
  register(request: RegisterUsuarioRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  // Lista todos los usuarios
  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtiene un usuario por DNI
  getByDni(dni: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${dni}`);
  }

  // Edita un usuario por DNI
  edit(dni: string, request: EditUsuarioRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dni}`, request);
  }

  // Elimina un usuario por DNI
  delete(dni: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${dni}`);
  }
}