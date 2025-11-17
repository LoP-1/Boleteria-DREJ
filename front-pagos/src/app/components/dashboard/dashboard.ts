// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { DashboardSummary, TimeSeriesPoint, TopConcept } from '../../models/Dashboard';
import { DashboardService } from '../../services/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';

// Registrar elementos de Chart.js
Chart.register(...registerables);

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  // Propiedades para filtros de fecha y unidad competente
  dateFrom: string | null = null;
  dateTo: string | null = null;
  unidadCompetente: string | null = null;

  // Estados de carga y datos del dashboard
  loading = false;
  summary: DashboardSummary | null = null;
  series: TimeSeriesPoint[] = [];
  topConcepts: TopConcept[] = [];

  // Configuración del gráfico de ingresos (línea)
  chartDataRevenue: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        backgroundColor: 'rgba(59,130,246,0.2)',
        borderColor: 'rgba(59,130,246,1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  // Opciones del gráfico de ingresos
  chartOptionsRevenue: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Configuración del gráfico de top conceptos (barras)
  chartDataTop: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Monto',
        backgroundColor: 'rgba(245,158,11,0.8)'
      }
    ]
  };

  // Opciones del gráfico de top conceptos
  chartOptionsTop: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { beginAtZero: true }
    }
  };

  // Propiedades para exportaciones
  exportFormat: 'csv' | 'xlsx' | 'json' = 'csv';
  exportLoading = false;

  // Constructor inyecta el servicio de dashboard
  constructor(private dashboardService: DashboardService) {}

  // Método de inicialización: establece fechas por defecto y carga datos
  ngOnInit(): void {
    const today = new Date();
    const from = this.subDaysNative(today, 29);
    this.dateFrom = this.toDateInputString(from);
    this.dateTo = this.toDateInputString(today);
    this.loadAll();
  }

  // Resta días a una fecha nativa
  private subDaysNative(d: Date, days: number): Date {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - days);
    return nd;
  }

  // Convierte fecha a string para input de tipo date
  private toDateInputString(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  // Aplica filtros y recarga datos
  applyFilters(): void {
    this.loadAll();
  }

  // Carga todos los datos del dashboard con filtros
  private loadAll(): void {
    this.loading = true;
    const params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      unidadCompetente: this.unidadCompetente
    };

    // Carga resumen
    this.dashboardService.getSummary(params).subscribe({
      next: s => this.summary = s,
      error: _ => this.summary = null
    });

    // Carga serie de ingresos
    this.dashboardService.getRevenue(params).subscribe({
      next: series => {
        this.series = series;
        this.buildRevenueChart(series);
      },
      error: _ => {
        this.series = [];
        this.clearRevenueChart();
      }
    });

    // Carga top conceptos
    this.dashboardService.getTopConcepts({ ...params, limit: 10, sortBy: 'amount' }).subscribe({
      next: top => {
        this.topConcepts = top;
        this.buildTopChart(top);
      },
      error: _ => {
        this.topConcepts = [];
        this.clearTopChart();
      }
    });

    // Simula finalización de carga
    setTimeout(() => this.loading = false, 300);
  }

  // Construye el gráfico de ingresos a partir de los datos
  private buildRevenueChart(series: TimeSeriesPoint[]): void {
    const labels = series.map(s => s.period);
    const data = series.map(s => Number(s.total ?? 0));
    this.chartDataRevenue = {
      labels,
      datasets: [
        {
          data,
          label: 'Ingresos',
          backgroundColor: 'rgba(59,130,246,0.2)',
          borderColor: 'rgba(59,130,246,1)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }

  // Limpia el gráfico de ingresos
  private clearRevenueChart(): void {
    this.chartDataRevenue = {
      labels: [],
      datasets: [{ data: [], label: 'Ingresos', backgroundColor: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,1)', fill: true }]
    };
  }

  // Construye el gráfico de top conceptos
  private buildTopChart(top: TopConcept[]): void {
    const sorted = [...top].sort((a, b) => Number(b.monto) - Number(a.monto)).slice(0, 10);
    const labels = sorted.map(t => t.nombre);
    const data = sorted.map(t => Number(t.monto ?? 0));
    this.chartDataTop = {
      labels,
      datasets: [{ data, label: 'Monto', backgroundColor: 'rgba(245,158,11,0.8)' }]
    };
  }

  // Limpia el gráfico de top conceptos
  private clearTopChart(): void {
    this.chartDataTop = {
      labels: [],
      datasets: [{ data: [], label: 'Monto', backgroundColor: 'rgba(245,158,11,0.8)' }]
    };
  }

  // Exporta ventas por día en Excel
  exportVentasPorDia(): void {
    if (!this.dateFrom || !this.dateTo) {
      alert('Selecciona rango de fechas antes de exportar.');
      return;
    }
    this.exportLoading = true;
    this.dashboardService.exportVentasPorDia(this.dateFrom, this.dateTo, 'excel').subscribe({
      next: blob => {
        const filename = `ventas_por_dia_${this.dateFrom}_${this.dateTo}.xlsx`;
        this.downloadBlob(blob, filename);
        this.exportLoading = false;
      },
      error: err => {
        console.error('Export error', err);
        alert('Error al exportar. Revisa consola.');
        this.exportLoading = false;
      }
    });
  }

  // Exporta boletas detalladas en Excel
  exportBoletasDetalladas(): void {
    if (!this.dateFrom || !this.dateTo) {
      alert('Selecciona rango de fechas antes de exportar.');
      return;
    }
    this.exportLoading = true;
    this.dashboardService.exportBoletasDetalladas(this.dateFrom, this.dateTo, 'excel').subscribe({
      next: blob => {
        const filename = `boletas_detalladas_${this.dateFrom}_${this.dateTo}.xlsx`;
        this.downloadBlob(blob, filename);
        this.exportLoading = false;
      },
      error: err => {
        console.error('Export error', err);
        alert('Error al exportar. Revisa consola.');
        this.exportLoading = false;
      }
    });
  }

  // Descarga un blob como archivo
  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  // Formatea un número como moneda
  formatMoney(value?: number | null): string {
    const n = Number(value ?? 0);
    return 'S/. ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}