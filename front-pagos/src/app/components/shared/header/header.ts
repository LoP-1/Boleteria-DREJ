import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class Header {
  nombre: string | null = null;
  role: string | null = null;

  constructor(private router: Router) {
    this.nombre = localStorage.getItem('nombreCompleto');
    this.role = localStorage.getItem('rol');
  }

  goUsuarios(): void {
    this.router.navigate(['/inicio/usuarios']);
  }

  goConceptos(): void {
    this.router.navigate(['/inicio/conceptos']);
  }
  goDashboard(): void {
    this.router.navigate(['/inicio/dashboard']);
  }

  goBoletas(): void {
    this.router.navigate(['/inicio/boleta']);
  }
  goListaBoletas(): void {
    this.router.navigate(['/inicio/lista']);
  }

  logout(): void {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}