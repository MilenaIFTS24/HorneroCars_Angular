import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Importamos el servicio y el "molde" de datos de Vehículo y Reserva.
import { VehiculosService, Vehiculo } from '../../../../../servicios/vehiculos.service';
import { ReservasService } from '../../../../../servicios/reservas.service';
import { User } from '../../../../../modelos/user';
import { Reserva } from '../../../../../modelos/reserva';

@Component({
  selector: 'app-hacer-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './hacer-reserva.component.html',
  styleUrls: ['./hacer-reserva.component.css']
})
export class HacerReservaComponent implements OnInit {

  // --- Propiedades para controlar el flujo ---
  public pasoActual = 1;

  // --- Propiedades para los formularios y datos ---
  public formPaso1!: FormGroup;
  public formPaso3!: FormGroup;
  public formPaso4!: FormGroup; // <-- Nuevo formulario para el pago
  public vehiculoElegido: Vehiculo | null = null;
  public cotizacion = { dias: 0, subtotalVehiculo: 0, costoExtras: 0, total: 0 };
  public pagoProcesando: boolean = false; // Para mostrar un spinner en el botón de pago

  // --- Propiedades para el catálogo ---
  private todosLosVehiculos: Vehiculo[] = [];
  public vehiculosFiltrados: Vehiculo[] = [];
  public marcasUnicas: string[] = [];
  public categoriaSeleccionada: string = '';
  public marcaSeleccionada: string = '';
  public isLoadingVehiculos: boolean = true;

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private reservasService: ReservasService, // Inyectamos el servicio de reservas
    private router: Router // Inyectamos el Router para redirigir al final
  ) { }

  ngOnInit(): void {
    // Se crea el formulario del Paso 1
    this.formPaso1 = this.fb.group({
      lugarRecogida: ['Buenos Aires, Aeropuerto Ezeiza', Validators.required],
      fechaRecogida: ['', Validators.required],
      horaRecogida: ['10:00', Validators.required],
      mismoLugar: [true],
      fechaDevolucion: ['', Validators.required],
      horaDevolucion: ['10:00', Validators.required]
    });

    // Se crea el formulario del Paso 3, INCLUYE LOS SEGUROS
    this.formPaso3 = this.fb.group({
      tipoSeguro: ['basico'], // Por defecto, el seguro básico está incluido
      sillaBebe: [false],
      gps: [false],
      conductorAdicional: [false]
    });

    this.formPaso3.valueChanges.subscribe(() => this.calcularCotizacion());

    this.formPaso4 = this.fb.group({
      metodoPago: ['tarjeta', Validators.required]
    });

  }

  // --- Lógica del Flujo ---

  irAlPaso2(): void {
    if (this.formPaso1.invalid) { alert('Por favor, completa los campos para continuar.'); return; }
    if (this.todosLosVehiculos.length === 0) { this.cargarVehiculos(); }
    this.pasoActual = 2;
  }

  seleccionarVehiculo(auto: Vehiculo): void {
    this.vehiculoElegido = auto;
    this.pasoActual = 3;
    this.calcularCotizacion();
  }

  confirmarYProcederAlPago(): void {
    this.pasoActual = 4;
  }

  // Función para el botón "Solo Reservar"
  soloReservar(): void {
    const reserva = this.crearObjetoReserva('Confirmada - Pendiente de Pago');
    if (!reserva) return;

    this.reservasService.agregarReserva(reserva);
    alert('¡Tu reserva ha sido confirmada con éxito!\nPuedes realizar el pago cuando quieras desde "Mis Reservas".');
    this.router.navigate(['/dashboardUser/mis-reservas']);
  }

  //Funcion para el boton Pagar y continaur
  finalizarReservaPagada(estado: 'Pagada'): void {
  if (this.pagoProcesando) return;
  this.pagoProcesando = true;

  setTimeout(() => {
    const reserva = this.crearObjetoReserva(estado); // Usa el parámetro recibido
    if (!reserva) {
      this.pagoProcesando = false;
      return;
    }

    this.reservasService.agregarReserva(reserva);
    alert('¡Pago procesado y reserva confirmada!\nGracias por tu confianza en Hornero Cars.');
    this.router.navigate(['/dashboardUser/mis-reservas']);

    this.pagoProcesando = false;
  }, 2000);
}


  // --- Funciones de Soporte ---

  calcularCotizacion(): void {
    if (!this.vehiculoElegido || !this.formPaso1.value.fechaRecogida || !this.formPaso1.value.fechaDevolucion) return;
    const fechaInicio = new Date(this.formPaso1.value.fechaRecogida);
    const fechaFin = new Date(this.formPaso1.value.fechaDevolucion);
    if (fechaFin <= fechaInicio) {
      this.cotizacion = { dias: 0, subtotalVehiculo: 0, costoExtras: 0, total: 0 };
      return;
    }
    const diffDias = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 3600 * 24)));

    let costoExtrasDiarios = 0;
    if (this.formPaso3.value.sillaBebe) costoExtrasDiarios += 1500;
    if (this.formPaso3.value.gps) costoExtrasDiarios += 1000;
    if (this.formPaso3.value.conductorAdicional) costoExtrasDiarios += 2500;

    // Se suma el costo del seguro seleccionado
    if (this.formPaso3.value.tipoSeguro === 'basico') costoExtrasDiarios += 3000; // Precio de ejemplo para seguro básico
    if (this.formPaso3.value.tipoSeguro === 'premium') costoExtrasDiarios += 5000; // Precio de ejemplo para seguro premium

    const subtotalVehiculo = this.vehiculoElegido.precio_dia * diffDias;
    const costoExtras = costoExtrasDiarios * diffDias;
    this.cotizacion = { dias: diffDias, subtotalVehiculo, costoExtras, total: subtotalVehiculo + costoExtras };
  }

  private crearObjetoReserva(estado: 'Pagada' | 'Confirmada - Pendiente de Pago'): Reserva | null {
    const usuarioActivoStr = sessionStorage.getItem('usuario'); // O la clave correcta 'usuario'
    if (!usuarioActivoStr || !this.vehiculoElegido) {
      alert('Error: No se pudo encontrar la información del usuario o del vehículo.');
      return null;
    }
    const usuarioActivo: User = JSON.parse(usuarioActivoStr);

    return {
      reservaId: 'RES-' + Date.now(),
      userId: usuarioActivo.userId,
      userNombre: usuarioActivo.nombreCompleto,
      vehiculoId: this.vehiculoElegido.id,
      vehiculoNombre: `${this.vehiculoElegido.marca} ${this.vehiculoElegido.modelo}`,
      fechaInicio: this.formPaso1.value.fechaRecogida,
      fechaFin: this.formPaso1.value.fechaDevolucion,
      dias: this.cotizacion.dias,
      costoTotal: this.cotizacion.total,
      costoVehiculo: this.cotizacion.subtotalVehiculo,
      costoSeguro: this.cotizacion.costoExtras,
      seguros: Object.keys(this.formPaso3.value).filter(key => this.formPaso3.value[key]),
      estado: estado,
      fechaCreacion: new Date().toISOString()
    };
  }

  // --- Funciones de soporte ---
  cargarVehiculos(): void { this.isLoadingVehiculos = true; this.vehiculosService.getVehiculos().subscribe({ next: data => { this.todosLosVehiculos = data; this.vehiculosFiltrados = data; this.marcasUnicas = [...new Set(data.map(a => a.marca))].sort(); this.isLoadingVehiculos = false; }, error: err => { console.error(err); this.isLoadingVehiculos = false; } }); }
  aplicarFiltros(): void { let temp = [...this.todosLosVehiculos]; if (this.categoriaSeleccionada) { temp = temp.filter(a => a.categoria === this.categoriaSeleccionada); } if (this.marcaSeleccionada) { temp = temp.filter(a => a.marca === this.marcaSeleccionada); } this.vehiculosFiltrados = temp; }
  limpiarFiltros(): void { this.categoriaSeleccionada = ''; this.marcaSeleccionada = ''; this.aplicarFiltros(); }
  volverAlPaso(paso: number): void { this.pasoActual = paso; }
}

