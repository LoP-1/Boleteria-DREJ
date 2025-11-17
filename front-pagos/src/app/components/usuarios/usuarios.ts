// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditUsuarioRequest, RegisterUsuarioRequest, Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario';

// Decorador del componente, define selector, si es standalone, imports y template
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html'
})
export class Usuarios implements OnInit {
  // Modelos para formularios
  registerModel: RegisterUsuarioRequest = { dni: '', nombreCompleto: '', password: '', rol: '' };
  searchDni = '';
  currentUser: Usuario | null = null;
  editModel: EditUsuarioRequest = { nombreCompleto: '', password: '', rol: '' };
  // Estados para mensajes
  message = '';
  error = '';
  
  // Lista de usuarios y estado de carga
  usuarios: Usuario[] = [];
  loadingList = false;

  // Constructor inyecta el servicio de usuarios
  constructor(private usuarioService: UsuarioService) {}

  // Método de inicialización: carga la lista de usuarios
  ngOnInit(): void {
    this.loadUsuarios();
  }

  // Carga todos los usuarios
  loadUsuarios(): void {
    this.loadingList = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data || [];
        this.loadingList = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingList = false;
      }
    });
  }

  // Selecciona un usuario de la lista y lo busca
  selectUsuario(usuario: Usuario): void {
    this.searchDni = usuario.dni;
    this.find();
  }

  // Registra un nuevo usuario
  register(): void {
    this.message = '';
    this.error = '';
    this.usuarioService.register(this.registerModel).subscribe({
      next: () => {
        this.message = 'Usuario registrado correctamente';
        // Resetea el formulario
        this.registerModel = { dni: '', nombreCompleto: '', password: '', rol: '' };
        this.loadUsuarios();
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error registrando usuario';
      }
    });
  }

  // Busca un usuario por DNI
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
        // Carga datos en el modelo de edición
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

  // Guarda los cambios en la edición
  saveEdit(): void {
    if (!this.currentUser) return;
    
    // Construye el payload solo con campos modificados
    const payload: any = {};
    
    if (this.editModel.nombreCompleto && this.editModel.nombreCompleto.trim() !== '') {
      payload.nombreCompleto = this.editModel.nombreCompleto.trim();
    }
    
    if (this.editModel.password && this.editModel.password.trim() !== '') {
      payload.password = this.editModel.password.trim();
    }
    
    if (this.editModel.rol && this.editModel.rol !== '') {
      payload.rol = this.editModel.rol;
    }
    
    if (Object.keys(payload).length === 0) {
      this.error = 'Debes modificar al menos un campo';
      return;
    }
    
    this.usuarioService.edit(this.currentUser.dni, payload).subscribe({
      next: () => {
        this.message = 'Usuario actualizado correctamente';
        this.editModel.password = ''; // Resetea la contraseña
        this.loadUsuarios();
        this.find(); // Recarga el usuario actual
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error actualizando usuario';
      }
    });
  }

  // Elimina el usuario actual
  delete(): void {
    if (!this.currentUser) return;
    
    if (!confirm(`Estas seguro de eliminar al usuario ${this.currentUser.nombreCompleto}?`)) {
      return;
    }
    
    const dni = this.currentUser.dni;
    this.usuarioService.delete(dni).subscribe({
      next: () => {
        this.message = 'Usuario eliminado correctamente';
        this.currentUser = null;
        this.searchDni = '';
        this.loadUsuarios();
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error eliminando usuario';
      }
    });
  }
}