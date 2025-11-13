import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoginRequest, LoginResponse } from '../../models/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  dni = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.error = '';
    const payload: LoginRequest = { dni: this.dni, password: this.password };
    this.auth.login(payload).subscribe({
      next: (res: LoginResponse) => {
        if ((res as any).rol) {
          localStorage.setItem('rol', (res as any).rol);
        }
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al iniciar sesión';
        console.error('Login error', err);
      }
    });
  }
}