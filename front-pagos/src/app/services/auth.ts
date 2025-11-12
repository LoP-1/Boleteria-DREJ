import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        // Guardar DNI en localStorage
        localStorage.setItem('dni', response.dni);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombreCompleto');
  }

  getDni(): string | null {
    return localStorage.getItem('dni');
  }

  getNombreCompleto(): string | null {
    return localStorage.getItem('nombreCompleto');
  }

  isLoggedIn(): boolean {
    return !!this.getDni();
  }
}