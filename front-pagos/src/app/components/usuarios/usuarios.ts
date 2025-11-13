import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditUsuarioRequest, RegisterUsuarioRequest, Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html'
})
export class Usuarios {
  // incluir rol en los modelos
  registerModel: RegisterUsuarioRequest = { dni: '', nombreCompleto: '', password: '', rol: '' };
  searchDni = '';
  currentUser: Usuario | null = null;
  editModel: EditUsuarioRequest = { nombreCompleto: '', password: '', rol: '' };
  message = '';
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  register(): void {
    this.message = '';
    this.error = '';
    this.usuarioService.register(this.registerModel).subscribe({
      next: () => {
        this.message = 'Usuario registrado correctamente';
        this.registerModel = { dni: '', nombreCompleto: '', password: '', rol: '' };
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error registrando usuario';
      }
    });
  }

  find(): void {
    this.error = '';
    this.message = '';
    if (!this.searchDni) {
      this.error = 'Ingresa un DNI para buscar';
      return;
    }
    this.usuarioService.getByDni(this.searchDni).subscribe({
      next: (u) => {
        this.currentUser = u;
        this.editModel = {
          nombreCompleto: u.nombreCompleto,
          password: '',
          rol: (u as any).rol ?? ''
        };
      },
      error: (err) => {
        console.error(err);
        this.error = 'Usuario no encontrado';
        this.currentUser = null;
      }
    });
  }

  saveEdit(): void {
    if (!this.currentUser) return;
    this.usuarioService.edit(this.currentUser.dni, this.editModel).subscribe({
      next: () => {
        this.message = 'Usuario actualizado';
        this.find();
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error actualizando usuario';
      }
    });
  }

  delete(): void {
    if (!this.currentUser) return;
    const dni = this.currentUser.dni;
    this.usuarioService.delete(dni).subscribe({
      next: () => {
        this.message = 'Usuario eliminado';
        this.currentUser = null;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error eliminando usuario';
      }
    });
  }
}