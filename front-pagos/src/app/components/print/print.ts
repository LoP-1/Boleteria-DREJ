// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletaService } from '../../services/boleta';
import { Boleta } from '../../models/Boleta';

// Decorador del componente, define selector, si es standalone, imports, template y estilos
@Component({
  selector: 'app-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.html',
  styleUrl: './print.css',
})
export class Print implements OnInit {
  // Propiedades para manejar el estado del componente
  boleta: Boleta | null = null;
  loading = true;
  error = '';
  fechaImpresion = new Date();

  // Constructor inyecta servicios necesarios
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boletaService: BoletaService
  ) {}

  // Método de inicialización: obtiene el ID de la ruta y carga la boleta
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBoleta(Number(id));
    } else {
      this.error = 'ID de boleta no proporcionado';
      this.loading = false;
    }
  }

  // Carga la boleta por ID desde el servicio
  loadBoleta(id: number): void {
    this.boletaService.getById(id).subscribe({
      next: (data) => {
        this.boleta = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la boleta';
        this.loading = false;
      }
    });
  }

  // Método para imprimir la página
  imprimir(): void {
    window.print();
  }

  // Método para volver a la página de inicio
  volver(): void {
    this.router.navigate(['/inicio']);
  }

  // Obtiene el nombre del concepto de un detalle
  getConceptoNombre(detalle: any): string {
    if (!detalle) return '-';
    if (detalle.concepto && detalle.concepto.nombre) return detalle.concepto.nombre;
    if (detalle.nombre) return detalle.nombre;
    return '-';
  }

  // Obtiene el precio unitario de un detalle
  getPrecioUnitario(detalle: any): number {
    if (!detalle) return 0;
    return Number(detalle.precioUnitario ?? detalle.concepto?.precio ?? 0);
  }

  // Calcula el subtotal de un detalle
  getSubtotal(detalle: any): number {
    if (!detalle) return 0;
    if (detalle.subtotal != null) return Number(detalle.subtotal);
    return this.getPrecioUnitario(detalle) * Number(detalle.cantidad ?? 0);
  }

  // Calcula el total de la boleta sumando los subtotales
  getTotal(): number {
    if (!this.boleta || !this.boleta.detalles) return 0;
    return this.boleta.detalles.reduce((sum, d) => sum + this.getSubtotal(d), 0);
  }

  // Formatea una fecha para mostrar en español
  formatDate(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE');
  }
}