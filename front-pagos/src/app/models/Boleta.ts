import { Conceptos } from "../conceptos/conceptos";

export enum EstadoBoleta {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA'
}

export interface DetalleBoleta {
  id?: number;
  concepto: Conceptos;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Boleta {
  id?: number;
  nombre: string;
  direccion: string;
  fechaEmision: string;
  documentoIdentidad: string;
  dniEncargado: string;
  estado: EstadoBoleta;
  detalles: DetalleBoleta[];
}

export interface DetalleRequest {
  conceptoId: number;
  cantidad: number;
}

export interface BoletaRequest {
  nombre: string;
  direccion: string;
  fechaEmision: string;
  documentoIdentidad: string;
  detalles: DetalleRequest[];
  dniEncargado: string;
}