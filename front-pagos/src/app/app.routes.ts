import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Inicio } from './components/inicio/inicio';
import { Usuarios } from './components/usuarios/usuarios';
import { Conceptos } from './components/conceptos/conceptos';
import { Boleta } from './components/boleta/boleta';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'inicio',
    component: Inicio,
    children: [
      { path: '', redirectTo: 'boleta', pathMatch: 'full' },
      { path: 'usuarios', component: Usuarios },
      { path: 'boleta', component: Boleta },
      { path: 'conceptos', component: Conceptos }
    ]
  },
  { path: 'usuarios', redirectTo: '/inicio/usuarios', pathMatch: 'full' },
  { path: 'conceptos', redirectTo: '/inicio/conceptos', pathMatch: 'full' },
  { path: 'boleta', redirectTo: '/inicio/boleta', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];