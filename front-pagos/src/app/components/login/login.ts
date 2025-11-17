// Importaciones necesarias para el componente
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoginRequest, LoginResponse } from '../../models/Usuario';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  // Propiedades para los campos del formulario
  dni = '';
  password = '';
  error = '';

  // Constructor inyecta servicios de autenticación y navegación
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // Método para realizar el login
  login(): void {
    this.error = '';
    // Prepara el payload para la solicitud de login
    const payload: LoginRequest = { dni: this.dni, password: this.password };
    this.auth.login(payload).subscribe({
      next: (res: LoginResponse) => {
        // Almacena el rol en localStorage si está presente
        if ((res as any).rol) {
          localStorage.setItem('rol', (res as any).rol);
        }
        // Navega a la página de inicio tras login exitoso
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        // Maneja errores y muestra mensaje
        this.error = err?.error?.message || 'Error al iniciar sesión';
        console.error('Login error', err);
      }
    });
  }
}