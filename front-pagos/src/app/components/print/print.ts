// Importaciones necesarias para el componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletaService } from '../../services/boleta';
import { Boleta } from '../../models/Boleta';

// Decorador del componente, define selector, si es standalone, imports, template y estilos
@Component({
  selector: 'app-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print.html',
  styleUrl: './print.css',
})
export class Print implements OnInit {
  // Propiedades para manejar el estado del componente
  boleta: Boleta | null = null;
  loading = true;
  error = '';
  fechaImpresion = new Date();

  // Constructor inyecta servicios necesarios
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boletaService: BoletaService
  ) {}

  // Método de inicialización: obtiene el ID de la ruta y carga la boleta
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBoleta(Number(id));
    } else {
      this.error = 'ID de boleta no proporcionado';
      this.loading = false;
    }
  }

  // Carga la boleta por ID desde el servicio
  loadBoleta(id: number): void {
    this.boletaService.getById(id).subscribe({
      next: (data) => {
        this.boleta = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la boleta';
        this.loading = false;
      }
    });
  }

  // Método para imprimir la página
  imprimir(): void {
    window.print();
  }

  // Método para volver a la página de inicio
  volver(): void {
    this.router.navigate(['/inicio']);
  }

  // Obtiene el nombre del concepto de un detalle
  getConceptoNombre(detalle: any): string {
    if (!detalle) return '-';
    if (detalle.concepto && detalle.concepto.nombre) return detalle.concepto.nombre;
    if (detalle.nombre) return detalle.nombre;
    return '-';
  }

  // Obtiene el precio unitario de un detalle
  getPrecioUnitario(detalle: any): number {
    if (!detalle) return 0;
    return Number(detalle.precioUnitario ?? detalle.concepto?.precio ?? 0);
  }

  // Calcula el subtotal de un detalle
  getSubtotal(detalle: any): number {
    if (!detalle) return 0;
    if (detalle.subtotal != null) return Number(detalle.subtotal);
    return this.getPrecioUnitario(detalle) * Number(detalle.cantidad ?? 0);
  }

  // Calcula el total de la boleta sumando los subtotales
  getTotal(): number {
    if (!this.boleta || !this.boleta.detalles) return 0;
    return this.boleta.detalles.reduce((sum, d) => sum + this.getSubtotal(d), 0);
  }

  // Formatea una fecha para mostrar en español
  formatDate(fecha: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE');
  }
  formatearId(id: number): string {
  return id.toString().padStart(6, '0');
}

numeroATexto(numero: number): string {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (numero === 0) return 'CERO';

  // Separar parte entera y decimales
  const parteEntera = Math.floor(numero);
  const decimales = Math.round((numero - parteEntera) * 100);

  let resultado = '';

  // Convertir parte entera
  if (parteEntera === 0) {
    resultado = 'CERO';
  } else {
    resultado = this.convertirEntero(parteEntera, unidades, decenas, especiales, centenas);
  }

  // Agregar decimales si existen
  if (decimales > 0) {
    resultado += ` CON ${decimales.toString().padStart(2, '0')}/100`;
  } else {
    resultado += ' CON 00/100';
  }

  return resultado;
}

// Función auxiliar para convertir la parte entera
private convertirEntero(num: number, unidades: string[], decenas: string[], especiales: string[], centenas: string[]): string {
  if (num === 0) return '';
  if (num === 100) return 'CIEN';
  if (num < 10) return unidades[num];
  if (num >= 10 && num < 20) return especiales[num - 10];
  if (num >= 20 && num < 100) {
    const dec = Math.floor(num / 10);
    const uni = num % 10;
    if (uni === 0) return decenas[dec];
    return decenas[dec] + ' Y ' + unidades[uni];
  }
  if (num >= 100 && num < 1000) {
    const cen = Math.floor(num / 100);
    const resto = num % 100;
    if (resto === 0) return num === 100 ? 'CIEN' : centenas[cen];
    return centenas[cen] + ' ' + this.convertirEntero(resto, unidades, decenas, especiales, centenas);
  }
  if (num >= 1000 && num < 1000000) {
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    let textoMiles = miles === 1 ? 'MIL' : this.convertirEntero(miles, unidades, decenas, especiales, centenas) + ' MIL';
    if (resto === 0) return textoMiles;
    return textoMiles + ' ' + this.convertirEntero(resto, unidades, decenas, especiales, centenas);
  }
  if (num >= 1000000) {
    const millones = Math.floor(num / 1000000);
    const resto = num % 1000000;
    let textoMillones = millones === 1 ? 'UN MILLON' : this.convertirEntero(millones, unidades, decenas, especiales, centenas) + ' MILLONES';
    if (resto === 0) return textoMillones;
    return textoMillones + ' ' + this.convertirEntero(resto, unidades, decenas, especiales, centenas);
  }
  return '';
}

}