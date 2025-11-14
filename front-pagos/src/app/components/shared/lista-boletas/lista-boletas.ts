import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoletaService } from '../../../services/boleta';
import { Boleta } from '../../../models/Boleta';

@Component({
  selector: 'app-lista-boletas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-boletas.html'
})
export class ListaBoletas implements OnInit, OnDestroy {
  boletas: Boleta[] = [];
  loading = false;
  processingId: number | null = null;
  error = '';
  message = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private boletaService: BoletaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendientes();
    
    this.subscriptions.push(
      this.boletaService.onBoletaCreada.subscribe(() => {
        this.loadPendientes();
      })
    );
    
    this.subscriptions.push(
      this.boletaService.onBoletaPagada.subscribe(() => {
        this.loadPendientes();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    if (!confirm('Marcar esta boleta como pagada?')) return;

    this.error = '';
    this.message = '';
    this.processingId = boleta.id;

    this.boletaService.markPaid(boleta.id).subscribe({
      next: (updated) => {
        this.message = `Boleta ${boleta.id} marcada como pagada`;
        this.processingId = null;
        
        if (confirm('Desea imprimir la boleta ahora?')) {
          window.open(`/print/${updated.id}`, '_blank');
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error marcando la boleta como pagada';
        this.processingId = null;
      }
    });
  }
}