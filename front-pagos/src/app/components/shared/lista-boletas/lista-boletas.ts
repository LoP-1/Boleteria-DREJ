import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoletaService } from '../../../services/boleta';
import { Boleta } from '../../../models/Boleta';

@Component({
  selector: 'app-lista-boletas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-boletas.html'
})
export class ListaBoletas implements OnInit {
  boletas: Boleta[] = [];
  loading = false;
  processingId: number | null = null;
  error = '';
  message = '';

  constructor(private boletaService: BoletaService) {}

  ngOnInit(): void {
    this.loadPendientes();
  }

  loadPendientes(): void {
    this.error = '';
    this.message = '';
    this.loading = true;
    this.boletaService.listPendientes().subscribe({
      next: (data) => {
        this.boletas = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las boletas pendientes';
        this.loading = false;
      }
    });
  }

  marcarPagada(boleta: Boleta): void {
    if (!boleta.id) return;
    // confirmación simple
    if (!confirm('¿Marcar esta boleta como pagada?')) return;

    this.error = '';
    this.message = '';
    this.processingId = boleta.id;

    this.boletaService.markPaid(boleta.id).subscribe({
      next: (updated) => {
        this.message = `Boleta ${boleta.id} marcada como pagada`;
        this.processingId = null;
        this.loadPendientes();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error marcando la boleta como pagada';
        this.processingId = null;
      }
    });
  }
}