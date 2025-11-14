import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletaService } from '../../services/boleta';
import { Boleta } from '../../models/Boleta';

@Component({
  selector: 'app-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.html',
  styleUrl: './print.css',
})
export class Print implements OnInit {
  boleta: Boleta | null = null;
  loading = true;
  error = '';
  fechaImpresion = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boletaService: BoletaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBoleta(Number(id));
    } else {
      this.error = 'ID de boleta no proporcionado';
      this.loading = false;
    }
  }

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

  imprimir(): void {
    window.print();
  }

  volver(): void {
    this.router.navigate(['/inicio']);
  }

  getConceptoNombre(detalle: any): string {
    if (!detalle) return '-';
    if (detalle.concepto && detalle.concepto.nombre) return detalle.concepto.nombre;
    if (detalle.nombre) return detalle.nombre;
    return '-';
  }

  getPrecioUnitario(detalle: any): number {
    if (!detalle) return 0;
    return Number(detalle.precioUnitario ?? detalle.concepto?.precio ?? 0);
  }

  getSubtotal(detalle: any): number {
    if (!detalle) return 0;
    if (detalle.subtotal != null) return Number(detalle.subtotal);
    return this.getPrecioUnitario(detalle) * Number(detalle.cantidad ?? 0);
  }

  getTotal(): number {
    if (!this.boleta || !this.boleta.detalles) return 0;
    return this.boleta.detalles.reduce((sum, d) => sum + this.getSubtotal(d), 0);
  }

  formatDate(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE');
  }
}