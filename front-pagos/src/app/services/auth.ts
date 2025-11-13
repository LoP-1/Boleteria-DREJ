import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/Usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('dni', response.dni);
        localStorage.setItem('nombreCompleto', response.nombreCompleto);
        localStorage.setItem('rol', response.rol ?? '');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('rol');
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