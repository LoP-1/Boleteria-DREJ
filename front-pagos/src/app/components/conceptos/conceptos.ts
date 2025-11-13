import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Concepto } from '../../models/Concepto';
import { ConceptoService } from '../../services/concepto';

@Component({
  selector: 'app-conceptos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conceptos.html'
})
export class Conceptos implements OnInit {
  conceptos: Concepto[] = [];
  // modelo para crear/editar
  nueva: Partial<Concepto> = { nombre: '', precio: 0 };
  editingId: number | null = null;
  error = '';

  constructor(private conceptoService: ConceptoService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.conceptoService.listAll().subscribe({
      next: (data) => (this.conceptos = data || []),
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los conceptos';
      }
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.nueva = { nombre: '', precio: 0 };
  }

  save(): void {
    this.error = '';
    if (this.editingId != null) {
      // update
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
      // create
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

  edit(con: Concepto): void {
    this.editingId = con.id ?? null;
    this.nueva = { ...con };
  }

  remove(id?: number): void {
    if (!id) return;
    this.conceptoService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        console.error(err);
        this.error = 'Error eliminando concepto';
      }
    });
  }
}