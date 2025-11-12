import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Inicio } from './inicio/inicio';
import { Usuarios } from './usuarios/usuarios';
import { Conceptos } from './conceptos/conceptos';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: 'inicio', 
    component: Inicio,
  },
  { 
    path: 'usuarios', 
    component: Usuarios 
  },
  { 
    path: 'conceptos', 
    component: Conceptos 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];