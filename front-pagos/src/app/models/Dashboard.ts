export interface DashboardSummary {
  totalBoletas: number;
  totalFacturado: number; 
  totalPendientes: number;
  totalItems: number;
}


export interface TimeSeriesPoint {
  period: string;
  total: number;
}

export interface TopConcept {
  conceptoId: number;
  nombre: string;
  cantidad: number;
  monto: number;
}

export interface DashboardQueryParams {
  dateFrom?: Date | string | null;
  dateTo?: Date | string | null;
  unidadCompetente?: string | null;
  limit?: number;
  sortBy?: 'amount' | 'quantity' | string;
}