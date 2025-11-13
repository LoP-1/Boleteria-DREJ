import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './inicio.html'
})
export class Inicio {}