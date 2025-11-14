import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Inicio } from './components/inicio/inicio';
import { Usuarios } from './components/usuarios/usuarios';
import { Conceptos } from './components/conceptos/conceptos';
import { Boleta } from './components/boleta/boleta';
import { BoletasList } from './components/boletas-list/boletas-list';
import { Print } from './components/print/print'; 
import { DashboardComponent } from './components/dashboard/dashboard';

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
      { path: 'conceptos', component: Conceptos },
      { path: 'lista', component: BoletasList },
      {path: 'dashboard', component: DashboardComponent}
    ]
  },
  {
    path: 'print/:id',
    component: Print 
  }
];