// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Concepto } from '../../models/Concepto';
import { ConceptoService } from '../../services/concepto';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-conceptos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conceptos.html'
})
export class Conceptos implements OnInit {
  // Lista de conceptos cargados
  conceptos: Concepto[] = [];
  // Modelo para nuevo o concepto en edición
  nueva: Partial<Concepto> = { 
    nombre: '', 
    precio: 0,
    unidadCompetente: '',
    pagina: ''
  };
  // ID del concepto en edición (null si es nuevo)
  editingId: number | null = null;
  // Mensaje de error
  error = '';

  // Constructor inyecta el servicio de conceptos
  constructor(private conceptoService: ConceptoService) {}

  // Método de inicialización: carga todos los conceptos
  ngOnInit(): void {
    this.loadAll();
  }

  // Carga todos los conceptos desde el servicio
  loadAll(): void {
    this.conceptoService.listAll().subscribe({
      next: (data) => (this.conceptos = data || []),
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los conceptos';
      }
    });
  }

  // Reinicia el formulario para crear un nuevo concepto
  startCreate(): void {
    this.editingId = null;
    this.nueva = { 
      nombre: '', 
      precio: 0,
      unidadCompetente: '',
      pagina: ''
    };
  }

  // Guarda o actualiza un concepto
  save(): void {
    this.error = '';
    
    // Validación de campos requeridos
    if (!this.nueva.nombre || !this.nueva.unidadCompetente || !this.nueva.pagina) {
      this.error = 'Completa todos los campos requeridos';
      return;
    }
    
    // Si está editando, actualiza; sino, crea nuevo
    if (this.editingId != null) {
      this.conceptoService.update(this.editingId, this.nueva as Concepto).subscribe({
        next: (res) => {
          this.loadAll();
          this.startCreate();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error actualizando concepto';
        }
      });
    } else {
      this.conceptoService.create(this.nueva as Concepto).subscribe({
        next: (res) => {
          this.loadAll();
          this.startCreate();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error creando concepto';
        }
      });
    }
  }

  // Carga un concepto para editar
  edit(con: Concepto): void {
    this.editingId = con.id ?? null;
    this.nueva = { 
      nombre: con.nombre,
      precio: con.precio,
      unidadCompetente: con.unidadCompetente,
      pagina: con.pagina
    };
  }

  // Elimina un concepto por ID
  remove(id?: number): void {
    if (!id) return;
    if (!confirm('Estas seguro de eliminar este concepto?')) return;
    
    this.conceptoService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        console.error(err);
        this.error = 'Error eliminando concepto';
      }
    });
  }
}