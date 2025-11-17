// Importaciones necesarias para el servicio
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/Usuario';
import { environment } from '../../environments/environment';

// Servicio para manejar autenticación
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de la API para autenticación
  private apiUrl = environment.apiUrl + '/auth';

  // Constructor inyecta HttpClient
  constructor(private http: HttpClient) {}

  // Método para login, almacena datos en localStorage
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('dni', response.dni);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
        localStorage.setItem('rol', response.rol ?? '');
      })
    );
  }

  // Método para logout, limpia localStorage
  logout(): void {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('rol');
  }

  // Obtiene el DNI del usuario logueado
  getDni(): string | null {
    return localStorage.getItem('dni');
  }

  // Obtiene el nombre completo del usuario logueado
  getNombreCompleto(): string | null {
    return localStorage.getItem('nombreCompleto');
  }

  // Verifica si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getDni();
  }
}