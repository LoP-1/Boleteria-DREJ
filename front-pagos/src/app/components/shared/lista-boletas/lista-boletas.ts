// Importaciones necesarias para el componente
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoletaService } from '../../../services/boleta';
import { Boleta } from '../../../models/Boleta';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-lista-boletas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-boletas.html'
})
export class ListaBoletas implements OnInit, OnDestroy {
  // Lista de boletas pendientes
  boletas: Boleta[] = [];
  // Estados de carga, procesamiento y mensajes
  loading = false;
  processingId: number | null = null;
  error = '';
  message = '';
  
  // Suscripciones para manejar eventos
  private subscriptions: Subscription[] = [];

  // Constructor inyecta servicios
  constructor(
    private boletaService: BoletaService,
    private router: Router
  ) {}

  // Método de inicialización: carga pendientes y suscribe a eventos
  ngOnInit(): void {
    this.loadPendientes();
    
    // Suscribirse a eventos de boleta creada para recargar
    this.subscriptions.push(
      this.boletaService.onBoletaCreada.subscribe(() => {
        this.loadPendientes();
      })
    );
    
    // Suscribirse a eventos de boleta pagada para recargar
    this.subscriptions.push(
      this.boletaService.onBoletaPagada.subscribe(() => {
        this.loadPendientes();
      })
    );
  }

  // Método de destrucción: limpia suscripciones
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Carga las boletas pendientes
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

  // Marca una boleta como pagada
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
        
        // Opción para imprimir tras marcar como pagada
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