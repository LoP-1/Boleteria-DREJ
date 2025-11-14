import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Boleta, EstadoBoleta } from '../../models/Boleta';
import { BoletaService } from '../../services/boleta';

@Component({
  selector: 'app-boletas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boletas-list.html'
})
export class BoletasList implements OnInit {
  boletas: Boleta[] = [];
  filtered: Boleta[] = [];
  public Math = Math;
  
  filterId: number | null = null;
  filterName = '';
  filterClienteDni = '';
  filterEncargadoDni = '';
  filterEstado: 'ALL' | EstadoBoleta.PENDIENTE | EstadoBoleta.PAGADA = 'ALL';
  filterFrom: string = '';
  filterTo: string = '';

  loading = false;
  error = '';
  message = '';
  expandedId: number | null = null;

  page = 1;
  pageSize = 20;

  constructor(private boletaService: BoletaService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.boletaService.listAll().subscribe({
      next: (data) => {
        this.boletas = data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las boletas';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.error = '';
    let items = [...this.boletas];

    if (this.filterId != null && this.filterId !== 0) {
      items = items.filter(b => b.id === this.filterId);
    }

    if (this.filterName && this.filterName.trim() !== '') {
      const q = this.filterName.trim().toLowerCase();
      items = items.filter(b => (b.nombre || '').toLowerCase().includes(q));
    }

    if (this.filterClienteDni && this.filterClienteDni.trim() !== '') {
      items = items.filter(b => (b.documentoIdentidad || '').includes(this.filterClienteDni.trim()));
    }

    if (this.filterEncargadoDni && this.filterEncargadoDni.trim() !== '') {
      items = items.filter(b => (b.dniEncargado || '').includes(this.filterEncargadoDni.trim()));
    }

    if (this.filterEstado && this.filterEstado !== 'ALL') {
      items = items.filter(b => (b.estado || '').toString().toUpperCase() === this.filterEstado);
    }

    if (this.filterFrom) {
      const from = new Date(this.filterFrom);
      items = items.filter(b => {
        const d = new Date(b.fechaEmision);
        return !isNaN(d.getTime()) && d >= from;
      });
    }
    if (this.filterTo) {
      const to = new Date(this.filterTo);
      items = items.filter(b => {
        const d = new Date(b.fechaEmision);
        return !isNaN(d.getTime()) && d <= to;
      });
    }

    this.filtered = items;
    this.page = 1;
  }

  resetFilters(): void {
    this.filterId = null;
    this.filterName = '';
    this.filterClienteDni = '';
    this.filterEncargadoDni = '';
    this.filterEstado = 'ALL';
    this.filterFrom = '';
    this.filterTo = '';
    this.applyFilters();
  }

  toggleExpand(b: Boleta): void {
    this.expandedId = this.expandedId === b.id ? null : (b.id ?? null);
  }

  imprimirBoleta(b: Boleta): void {
    if (b.id) {
      window.open(`/print/${b.id}`, '_blank');
    }
  }

  marcarPagada(b: Boleta): void {
    if (!b.id) return;
    if (!confirm(`Marcar boleta ${b.id} como pagada?`)) return;
    this.loading = true;
    this.boletaService.markPaid(b.id).subscribe({
      next: () => {
        this.message = `Boleta ${b.id} marcada como pagada`;
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error marcando como pagada';
        this.loading = false;
      }
    });
  }

  eliminar(b: Boleta): void {
    if (!b.id) return;
    if (!confirm(`Eliminar boleta ${b.id}?`)) return;
    this.loading = true;
    this.boletaService.delete(b.id).subscribe({
      next: () => {
        this.message = `Boleta ${b.id} eliminada`;
        this.loadAll();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error eliminando boleta';
        this.loading = false;
      }
    });
  }

  subtotalDetalle(d: any): number {
    if (!d) return 0;
    if (d.subtotal != null) return Number(d.subtotal);
    const precio = d.precioUnitario ?? d.concepto?.precio ?? 0;
    const cantidad = Number(d.cantidad ?? 0);
    return precio * cantidad;
  }

  totalBoleta(b: Boleta): number {
    if (!b?.detalles || b.detalles.length === 0) return 0;
    return b.detalles.reduce((sum: number, d: any) => sum + this.subtotalDetalle(d), 0);
  }

  get paged(): Boleta[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.filtered.length) this.page++;
  }
  getConceptoNombre(detalle: any): string {
    if (!detalle) return '-';
    if (detalle.concepto && detalle.concepto.nombre) return detalle.concepto.nombre;
    if (detalle.nombre) return detalle.nombre;
    return '-';
  }
}