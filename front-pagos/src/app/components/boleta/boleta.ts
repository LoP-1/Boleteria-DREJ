import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Concepto } from '../../models/Concepto';
import { BoletaService } from '../../services/boleta';
import { ConceptoService } from '../../services/concepto';
import { ListaBoletas } from "../shared/lista-boletas/lista-boletas";
import { HistorialUsuario } from "../shared/historial-usuario/historial-usuario";

interface DetalleForm {
  conceptoId: number | null;
  cantidad: number;
}

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaBoletas, HistorialUsuario],
  templateUrl: './boleta.html'
})

export class Boleta implements OnInit {
  // Campos del formulario
  nombre = '';
  direccion = '';
  fechaEmision = '';
  documentoIdentidad = '';

  nombreEncargado: string | null = null;
  dniEncargado: string | null = null;

  conceptos: Concepto[] = [];

  detalleModel: DetalleForm = { conceptoId: null, cantidad: 1 };
  detallesForm: Array<{ conceptoId: number; cantidad: number; nombre: string; precioUnitario: number; subtotal: number }> = [];

  error = '';
  message = '';
  loading = false;

  constructor(
    private boletaService: BoletaService,
    private conceptoService: ConceptoService
  ) {}

  ngOnInit(): void {
    this.dniEncargado = localStorage.getItem('dni');
    this.nombreEncargado = localStorage.getItem('nombreCompleto') || this.nombreEncargado;
    this.loadConceptos();
  }

  loadConceptos(): void {
    this.conceptoService.listAll().subscribe({
      next: (data) => (this.conceptos = data || []),
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los conceptos';
      }
    });
  }

  agregarDetalle(): void {
    this.error = '';
    const conceptoId = this.detalleModel.conceptoId;
    const cantidad = this.detalleModel.cantidad;

    if (!conceptoId || cantidad <= 0) {
      this.error = 'Selecciona un concepto y una cantidad válida';
      return;
    }

    const concepto = this.conceptos.find(c => c.id === conceptoId);
    if (!concepto) {
      this.error = 'Concepto no encontrado';
      return;
    }

    const precioUnitario = concepto.precio;
    const subtotal = Number((precioUnitario * cantidad).toFixed(2));

    // si ya existe el concepto en detalles, acumular cantidad
    const existente = this.detallesForm.find(d => d.conceptoId === conceptoId);
    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = Number((existente.precioUnitario * existente.cantidad).toFixed(2));
    } else {
      this.detallesForm.push({
        conceptoId,
        cantidad,
        nombre: concepto.nombre,
        precioUnitario,
        subtotal
      });
    }

    // reset modelo de detalle
    this.detalleModel = { conceptoId: null, cantidad: 1 };
  }

  quitarDetalle(conceptoId: number): void {
    this.detallesForm = this.detallesForm.filter(d => d.conceptoId !== conceptoId);
  }

  get total(): number {
    return this.detallesForm.reduce((sum, d) => sum + d.subtotal, 0);
  }

  submit(): void {
    this.error = '';
    this.message = '';

    if (!this.nombre) {
      this.error = 'Ingresa el nombre del cliente';
      return;
    }
    if (!this.documentoIdentidad) {
      this.error = 'Ingresa el documento de identidad del cliente';
      return;
    }
    if (!this.fechaEmision) {
      this.error = 'Ingresa la fecha de emisión';
      return;
    }
    if (!this.dniEncargado) {
      this.error = 'No se encontró el DNI del encargado en localStorage';
      return;
    }
    if (this.detallesForm.length === 0) {
      this.error = 'Agrega al menos un detalle';
      return;
    }

    const payload = {
      nombre: this.nombre,
      direccion: this.direccion,
      fechaEmision: this.fechaEmision,
      documentoIdentidad: this.documentoIdentidad,
      detalles: this.detallesForm.map(d => ({ conceptoId: d.conceptoId, cantidad: d.cantidad })),
      dniEncargado: this.dniEncargado
    };

    this.loading = true;
    this.boletaService.create(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = 'Boleta creada correctamente';
        // limpiar formulario
        this.nombre = '';
        this.direccion = '';
        this.fechaEmision = '';
        this.documentoIdentidad = '';
        this.detallesForm = [];
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error creando la boleta';
      }
    });
  }
}