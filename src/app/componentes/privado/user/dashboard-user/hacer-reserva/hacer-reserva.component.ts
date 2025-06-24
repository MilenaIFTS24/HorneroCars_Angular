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
  public vehiculoElegido: Vehiculo | null = null;

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
  ) { }

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
  }

  // --- Funciones para manejar el flujo entre pasos ---
  irAlPaso2(): void {
    if (this.formPaso1.invalid) { alert('Por favor, completa los campos para continuar.'); return; }
    if (this.todosLosVehiculos.length === 0) { this.cargarVehiculos(); }
    this.pasoActual = 2;
  }

  seleccionarVehiculo(auto: Vehiculo): void {
    this.vehiculoElegido = auto;
    this.pasoActual = 3;
    alert(`Has seleccionado el ${auto.marca} ${auto.modelo}. Próximo paso: configurar extras.`);
  }

  volverAlPaso(paso: number): void {
    this.pasoActual = paso;
  }

  // --- Lógica de Negocio ---
  cargarVehiculos(): void {
    this.isLoadingVehiculos = true;
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.todosLosVehiculos = data;
        this.vehiculosFiltrados = data;
        this.marcasUnicas = [...new Set(data.map(auto => auto.marca))].sort();
        this.isLoadingVehiculos = false;
      },
      error: (err) => { this.isLoadingVehiculos = false; console.error(err); }
    });
  }

  aplicarFiltros(): void {
    let temp = [...this.todosLosVehiculos];
    if (this.categoriaSeleccionada) { temp = temp.filter(auto => auto.categoria === this.categoriaSeleccionada); }
    if (this.marcaSeleccionada) { temp = temp.filter(auto => auto.marca === this.marcaSeleccionada); }
    this.vehiculosFiltrados = temp;
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.aplicarFiltros();
  }
}