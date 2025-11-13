import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoletaService } from '../../../services/boleta';
import { Boleta } from '../../../models/Boleta';

@Component({
  selector: 'app-historial-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-usuario.html'
})
export class HistorialUsuario implements OnInit {
  boletas: Boleta[] = [];
  loading = false;
  error = '';
  nombreEncargado: string | null = null;
  dniEncargado: string | null = null;

  constructor(private boletaService: BoletaService) {}

  ngOnInit(): void {
    this.dniEncargado = localStorage.getItem('dni');
    this.nombreEncargado = localStorage.getItem('nombreCompleto');
    this.loadHistorial();
  }

  loadHistorial(): void {
    this.error = '';
    if (!this.dniEncargado) {
      this.error = 'No se encontró DNI del encargado en localStorage';
      return;
    }

    this.loading = true;
    this.boletaService.listByEncargado(this.dniEncargado).subscribe({
      next: (data) => {
        this.boletas = (data || []).filter(b => (b.estado ?? '').toString().toUpperCase() === 'PAGADA');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el historial de boletas';
        this.loading = false;
      }
    });
  }

  conceptoNombre(d: any): string {
    if (!d) return '—';
    if (d.concepto && (d.concepto.nombre || d.concepto.nombre === '')) return d.concepto.nombre;
    if (d.nombre) return d.nombre;
    if (typeof d.concepto === 'number' || typeof d.concepto === 'string') return `ID:${d.concepto}`;
    return '—';
  }

  precioUnitario(d: any): number {
    if (!d) return 0;
    const p = d.precioUnitario ?? d.concepto?.precio ?? d.concepto?.precioUnitario ?? d.precio;
    return Number(p ?? 0);
  }

  subtotalDetalle(d: any): number {
    if (!d) return 0;
    if (d.subtotal != null) return Number(d.subtotal);
    const precio = this.precioUnitario(d);
    const cantidad = Number(d.cantidad ?? 0);
    return Number((precio * cantidad) || 0);
  }

  totalBoleta(b: Boleta): number {
    if (!b?.detalles || b.detalles.length === 0) return 0;
    return b.detalles.reduce((sum: number, d: any) => sum + this.subtotalDetalle(d), 0);
  }
}