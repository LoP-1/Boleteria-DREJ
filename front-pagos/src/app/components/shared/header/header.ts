// Importaciones necesarias para el componente
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class Header {
  // Propiedades para datos del usuario desde localStorage
  nombre: string | null = null;
  role: string | null = null;

  // Constructor obtiene datos del usuario y configura el router
  constructor(private router: Router) {
    this.nombre = localStorage.getItem('nombreCompleto');
    this.role = localStorage.getItem('rol');
  }

  // Navega a la página de usuarios (solo ADMIN)
  goUsuarios(): void {
    this.router.navigate(['/inicio/usuarios']);
  }

  // Navega a la página de conceptos (solo ADMIN)
  goConceptos(): void {
    this.router.navigate(['/inicio/conceptos']);
  }

  // Navega al dashboard
  goDashboard(): void {
    this.router.navigate(['/inicio/dashboard']);
  }

  // Navega a la página de boletas
  goBoletas(): void {
    this.router.navigate(['/inicio/boleta']);
  }

  // Navega a la lista de boletas (solo ADMIN)
  goListaBoletas(): void {
    this.router.navigate(['/inicio/lista']);
  }

  // Cierra sesión limpiando localStorage y redirige al login
  logout(): void {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}