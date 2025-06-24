import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importamos el servicio y el "molde" de datos de Vehículo.
import { VehiculosService, Vehiculo } from '../../../../../servicios/vehiculos.service';

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
  public formPaso3!: FormGroup; // <-- Nuevo formulario para los extras
  public vehiculoElegido: Vehiculo | null = null;
  
  // Objeto para guardar los datos de la cotización en tiempo real
  public cotizacion = {
    dias: 0,
    subtotalVehiculo: 0,
    costoExtras: 0,
    total: 0
  };

  // --- Propiedades para el catálogo ---
  private todosLosVehiculos: Vehiculo[] = [];
  public vehiculosFiltrados: Vehiculo[] = [];
  public marcasUnicas: string[] = [];
  public categoriaSeleccionada: string = '';
  public marcaSeleccionada: string = '';
  public isLoadingVehiculos: boolean = true;

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    // Se crea la estructura del formulario del Paso 1.
    this.formPaso1 = this.fb.group({
      lugarRecogida: ['Buenos Aires, Aeropuerto Ezeiza', Validators.required],
      fechaRecogida: ['', Validators.required],
      horaRecogida: ['10:00', Validators.required],
      mismoLugar: [true],
      fechaDevolucion: ['', Validators.required],
      horaDevolucion: ['10:00', Validators.required]
    });

    // Se crea la estructura del formulario del Paso 3 para los extras.
    this.formPaso3 = this.fb.group({
      sillaBebe: [false],
      gps: [false],
      conductorAdicional: [false]
    });

    // Nos "suscribimos" a los cambios en el formulario de extras.
    // Cada vez que el usuario marque o desmarque una opción, se volverá a calcular la cotización.
    this.formPaso3.valueChanges.subscribe(() => {
      this.calcularCotizacion();
    });
  }

  // Avanza al Paso 2
  irAlPaso2(): void {
    if (this.formPaso1.invalid) {
      alert('Por favor, completa los campos para continuar.');
      return;
    }
    if (this.todosLosVehiculos.length === 0) {
      this.cargarVehiculos();
    }
    this.pasoActual = 2;
  }
  
  // Se ejecuta al elegir un vehículo
  seleccionarVehiculo(auto: Vehiculo): void {
    this.vehiculoElegido = auto;
    this.pasoActual = 3; // Avanzamos al Paso 3
    this.calcularCotizacion(); // Calculamos la cotización por primera vez
  }

  /**
   * Calcula el costo total de la reserva (vehículo + extras)
   * y actualiza el objeto 'cotizacion'.
   */
  calcularCotizacion(): void {
    if (!this.vehiculoElegido || !this.formPaso1.value.fechaRecogida || !this.formPaso1.value.fechaDevolucion) {
      return;
    }

    // 1. Calcular número de días
    const fechaInicio = new Date(this.formPaso1.value.fechaRecogida);
    const fechaFin = new Date(this.formPaso1.value.fechaDevolucion);
    if (fechaFin <= fechaInicio) {
        this.cotizacion = { dias: 0, subtotalVehiculo: 0, costoExtras: 0, total: 0 };
        return;
    }
    const diffTiempo = fechaFin.getTime() - fechaInicio.getTime();
    const diffDias = Math.max(1, Math.ceil(diffTiempo / (1000 * 3600 * 24)));
    
    // 2. Calcular costo de los extras seleccionados
    let costoExtrasDiarios = 0;
    if (this.formPaso3.value.sillaBebe) costoExtrasDiarios += 1500; // Precios de ejemplo
    if (this.formPaso3.value.gps) costoExtrasDiarios += 1000;
    if (this.formPaso3.value.conductorAdicional) costoExtrasDiarios += 2500;

    // 3. Actualizar el objeto de cotización con los nuevos cálculos
    const subtotalVehiculo = this.vehiculoElegido.precio_dia * diffDias;
    const costoExtras = costoExtrasDiarios * diffDias;
    this.cotizacion = {
      dias: diffDias,
      subtotalVehiculo: subtotalVehiculo,
      costoExtras: costoExtras,
      total: subtotalVehiculo + costoExtras
    };
  }

  // Placeholder para el futuro Paso 4
  irAlPaso4(): void {
    console.log('Reserva final a confirmar:', {
        detallesViaje: this.formPaso1.value,
        vehiculo: this.vehiculoElegido,
        extras: this.formPaso3.value,
        cotizacionFinal: this.cotizacion
    });
    alert('¡Perfecto! Siguiente paso: Confirmación y Pago.');
    // this.pasoActual = 4; // Descomentar cuando creemos el Paso 4
  }

  // --- Funciones de soporte (sin cambios) ---
  cargarVehiculos(): void { this.isLoadingVehiculos = true; this.vehiculosService.getVehiculos().subscribe({ next: data => { this.todosLosVehiculos = data; this.vehiculosFiltrados = data; this.marcasUnicas = [...new Set(data.map(a => a.marca))].sort(); this.isLoadingVehiculos = false; }, error: err => { console.error(err); this.isLoadingVehiculos = false; } }); }
  aplicarFiltros(): void { let temp = [...this.todosLosVehiculos]; if (this.categoriaSeleccionada) { temp = temp.filter(a => a.categoria === this.categoriaSeleccionada); } if (this.marcaSeleccionada) { temp = temp.filter(a => a.marca === this.marcaSeleccionada); } this.vehiculosFiltrados = temp; }
  limpiarFiltros(): void { this.categoriaSeleccionada = ''; this.marcaSeleccionada = ''; this.aplicarFiltros(); }
  volverAlPaso(paso: number): void { this.pasoActual = paso; }
}