// Importaciones necesarias para el componente
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoletaService } from '../../../services/boleta';
import { Boleta } from '../../../models/Boleta';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-historial-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-usuario.html'
})
export class HistorialUsuario implements OnInit, OnDestroy {
  // Lista de boletas pagadas
  boletas: Boleta[] = [];
  // Estados de carga y error
  loading = false;
  error = '';
  // Datos del encargado desde localStorage
  nombreEncargado: string | null = null;
  dniEncargado: string | null = null;
  
  // Suscripciones para manejar eventos
  private subscriptions: Subscription[] = [];

  // Constructor inyecta el servicio de boletas
  constructor(private boletaService: BoletaService) {}

  // Método de inicialización: carga datos del encargado y historial
  ngOnInit(): void {
    this.dniEncargado = localStorage.getItem('dni');
    this.nombreEncargado = localStorage.getItem('nombreCompleto');
    this.loadHistorial();

    // Suscribirse a eventos de boleta pagada para recargar
    this.subscriptions.push(
      this.boletaService.onBoletaPagada.subscribe(() => {
        this.loadHistorial();
      })
    );
  }

  // Método de destrucción: limpia suscripciones
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Carga el historial de boletas pagadas del encargado
  loadHistorial(): void {
    this.error = '';
    if (!this.dniEncargado) {
      this.error = 'No se encontro DNI del encargado';
      return;
    }

    this.loading = true;
    this.boletaService.listByEncargado(this.dniEncargado).subscribe({
      next: (data) => {
        // Filtra solo las boletas pagadas
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

  // Abre la ventana de impresión para una boleta
  imprimirBoleta(boleta: Boleta): void {
    if (boleta.id) {
      window.open(`/print/${boleta.id}`, '_blank');
    }
  }

  // Obtiene el nombre del concepto de un detalle
  conceptoNombre(d: any): string {
    if (!d) return '---';
    if (d.concepto && (d.concepto.nombre || d.concepto.nombre === '')) return d.concepto.nombre;
    if (d.nombre) return d.nombre;
    if (typeof d.concepto === 'number' || typeof d.concepto === 'string') return `ID:${d.concepto}`;
    return '---';
  }

  // Obtiene el precio unitario de un detalle
  precioUnitario(d: any): number {
    if (!d) return 0;
    const p = d.precioUnitario ?? d.concepto?.precio ?? d.concepto?.precioUnitario ?? d.precio;
    return Number(p ?? 0);
  }

  // Calcula el subtotal de un detalle
  subtotalDetalle(d: any): number {
    if (!d) return 0;
    if (d.subtotal != null) return Number(d.subtotal);
    const precio = this.precioUnitario(d);
    const cantidad = Number(d.cantidad ?? 0);
    return Number((precio * cantidad) || 0);
  }

  // Calcula el total de una boleta
  totalBoleta(b: Boleta): number {
    if (!b?.detalles || b.detalles.length === 0) return 0;
    return b.detalles.reduce((sum: number, d: any) => sum + this.subtotalDetalle(d), 0);
  }
}