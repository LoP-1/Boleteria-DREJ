// Importaciones necesarias para el componente
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Concepto } from '../../models/Concepto';
import { BoletaService } from '../../services/boleta';
import { ConceptoService } from '../../services/concepto';
import { ListaBoletas } from "../shared/lista-boletas/lista-boletas";
import { HistorialUsuario } from "../shared/historial-usuario/historial-usuario";

// Interfaz para el modelo de detalle temporal antes de agregar
interface DetalleForm {
  conceptoId: number | null;
  cantidad: number;
}

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaBoletas, HistorialUsuario],
  templateUrl: './boleta.html'
})
export class Boleta implements OnInit {
  // Propiedades para datos del cliente
  nombre = '';
  direccion = '';
  fechaEmision = '';
  documentoIdentidad = '';

  // Propiedades para información del encargado (desde localStorage)
  nombreEncargado: string | null = null;
  dniEncargado: string | null = null;

  // Listas y estados para conceptos y autocompletado
  conceptos: Concepto[] = [];
  conceptosFiltrados: Concepto[] = [];
  busquedaConcepto = '';
  mostrarAutocompletado = false;
  
  // Modo de selección: buscar (autocompletado) o seleccionar (dropdown)
  modoSeleccion: 'buscar' | 'seleccionar' = 'buscar';

  // Modelo temporal para agregar detalle
  detalleModel: DetalleForm = { conceptoId: null, cantidad: 1 };
  // Lista de detalles agregados al formulario
  detallesForm: Array<{ conceptoId: number; cantidad: number; nombre: string; precioUnitario: number; subtotal: number }> = [];

  // Estados para mensajes de error, éxito y carga
  error = '';
  message = '';
  loading = false;

  // Constructor inyecta servicios necesarios
  constructor(
    private boletaService: BoletaService,
    private conceptoService: ConceptoService
  ) {}

  // Listener para cerrar el dropdown de autocompletado al hacer click fuera
  @HostListener('document:click', ['$event'])
  clickOutside(event: any): void {
    const target = event.target;
    const clickedInside = target.closest('.autocomplete-container');
    if (!clickedInside) {
      this.mostrarAutocompletado = false;
    }
  }

  // Método de inicialización: carga datos del encargado y conceptos
  ngOnInit(): void {
    this.dniEncargado = localStorage.getItem('dni');
    this.nombreEncargado = localStorage.getItem('nombreCompleto') || this.nombreEncargado;
    this.loadConceptos();
  }

  // Carga la lista completa de conceptos desde el servicio
  loadConceptos(): void {
    this.conceptoService.listAll().subscribe({
      next: (data) => {
        this.conceptos = data || [];
        this.conceptosFiltrados = [...this.conceptos];
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los conceptos';
      }
    });
  }

  // Filtra conceptos basado en la búsqueda, limita a 10 resultados
  filtrarConceptos(): void {
    const busqueda = this.busquedaConcepto.toLowerCase().trim();
    
    if (busqueda === '') {
      // Si no hay búsqueda, muestra los primeros 10
      this.conceptosFiltrados = this.conceptos.slice(0, 10);
      this.mostrarAutocompletado = true;
      return;
    }

    // Filtra por nombre y limita a 10
    this.conceptosFiltrados = this.conceptos
      .filter(c => c.nombre.toLowerCase().includes(busqueda))
      .slice(0, 10);
    
    this.mostrarAutocompletado = this.conceptosFiltrados.length > 0;
  }

  // Selecciona un concepto del autocompletado y actualiza el modelo
  seleccionarConcepto(concepto: Concepto): void {
    this.detalleModel.conceptoId = concepto.id ?? null;
    this.busquedaConcepto = concepto.nombre;
    this.mostrarAutocompletado = false;
  }
  
  // Cambia el modo de selección entre buscar y seleccionar, resetea estados
  cambiarModoSeleccion(modo: 'buscar' | 'seleccionar'): void {
    this.modoSeleccion = modo;
    this.detalleModel.conceptoId = null;
    this.busquedaConcepto = '';
    this.mostrarAutocompletado = false;
  }
  
  // Actualiza la búsqueda cuando cambia la selección en el dropdown
  onSelectChange(): void {
    const concepto = this.conceptos.find(c => c.id === this.detalleModel.conceptoId);
    if (concepto) {
      this.busquedaConcepto = concepto.nombre;
    }
  }

  // Agrega un detalle a la lista, maneja cantidades si ya existe el concepto
  agregarDetalle(): void {
    this.error = '';
    const conceptoId = this.detalleModel.conceptoId;
    const cantidad = this.detalleModel.cantidad;

    if (!conceptoId || cantidad <= 0) {
      this.error = 'Selecciona un concepto y una cantidad valida';
      return;
    }

    const concepto = this.conceptos.find(c => c.id === conceptoId);
    if (!concepto) {
      this.error = 'Concepto no encontrado';
      return;
    }

    const precioUnitario = concepto.precio;
    const subtotal = Number((precioUnitario * cantidad).toFixed(2));

    // Si el concepto ya existe, suma la cantidad; sino, agrega nuevo
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

    // Resetea el modelo temporal
    this.detalleModel = { conceptoId: null, cantidad: 1 };
    this.busquedaConcepto = '';
    this.mostrarAutocompletado = false;
  }

  // Remueve un detalle de la lista por conceptoId
  quitarDetalle(conceptoId: number): void {
    this.detallesForm = this.detallesForm.filter(d => d.conceptoId !== conceptoId);
  }

  // Getter para calcular el total de la boleta
  get total(): number {
    return this.detallesForm.reduce((sum, d) => sum + d.subtotal, 0);
  }

  // Envía el formulario para crear la boleta, valida campos requeridos
  submit(): void {
    this.error = '';
    this.message = '';

    // Validaciones de campos requeridos
    if (!this.nombre) {
      this.error = 'Ingresa el nombre del cliente';
      return;
    }
    if (!this.documentoIdentidad) {
      this.error = 'Ingresa el documento de identidad del cliente';
      return;
    }
    if (!this.fechaEmision) {
      this.error = 'Ingresa la fecha de emision';
      return;
    }
    if (!this.dniEncargado) {
      this.error = 'No se encontro el DNI del encargado en localStorage';
      return;
    }
    if (this.detallesForm.length === 0) {
      this.error = 'Agrega al menos un detalle';
      return;
    }

    // Prepara el payload para el servicio
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
        // Resetea el formulario tras éxito
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