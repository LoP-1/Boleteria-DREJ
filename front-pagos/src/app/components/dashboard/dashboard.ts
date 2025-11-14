import { Component, OnInit } from '@angular/core';
import { DashboardSummary, TimeSeriesPoint, TopConcept } from '../../models/Dashboard';
import { DashboardService } from '../../services/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

import { Chart, registerables, ChartData, ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  dateFrom: string | null = null;
  dateTo: string | null = null;
  unidadCompetente: string | null = null;

  loading = false;
  summary: DashboardSummary | null = null;
  series: TimeSeriesPoint[] = [];
  topConcepts: TopConcept[] = [];

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

  exportFormat: 'csv' | 'xlsx' | 'json' = 'csv';
  exportLoading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const today = new Date();
    const from = this.subDaysNative(today, 29);
    this.dateFrom = this.toDateInputString(from);
    this.dateTo = this.toDateInputString(today);
    this.loadAll();
  }

  private subDaysNative(d: Date, days: number): Date {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - days);
    return nd;
  }

  private toDateInputString(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  applyFilters(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    const params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      unidadCompetente: this.unidadCompetente
    };

    this.dashboardService.getSummary(params).subscribe({
      next: s => this.summary = s,
      error: _ => this.summary = null
    });

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

    setTimeout(() => this.loading = false, 300);
  }

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

  private clearRevenueChart(): void {
    this.chartDataRevenue = {
      labels: [],
      datasets: [{ data: [], label: 'Ingresos', backgroundColor: 'rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,1)', fill: true }]
    };
  }

  private buildTopChart(top: TopConcept[]): void {
    const sorted = [...top].sort((a, b) => Number(b.monto) - Number(a.monto)).slice(0, 10);
    const labels = sorted.map(t => t.nombre);
    const data = sorted.map(t => Number(t.monto ?? 0));
    this.chartDataTop = {
      labels,
      datasets: [{ data, label: 'Monto', backgroundColor: 'rgba(245,158,11,0.8)' }]
    };
  }

  private clearTopChart(): void {
    this.chartDataTop = {
      labels: [],
      datasets: [{ data: [], label: 'Monto', backgroundColor: 'rgba(245,158,11,0.8)' }]
    };
  }

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

  formatMoney(value?: number | null): string {
    const n = Number(value ?? 0);
    return 'S/. ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}