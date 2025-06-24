import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService, Vehiculo } from '../../../../servicios/vehiculos.service';

@Component({
  selector: 'app-vehiculos',
  standalone: true,  // Indica que este componente gestiona sus propias dependencias
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  private todosLosVehiculos: Vehiculo[] = [];
  public vehiculosFiltrados: Vehiculo[] = [];

  // Propiedades para los filtros
  public marcasUnicas: string[] = [];
  public categoriaSeleccionada: string = '';
  public marcaSeleccionada: string = '';

  constructor(private vehiculosService: VehiculosService) { }

  ngOnInit(): void {
    console.log("VehiculosComponent: Cargando vehículos...");

    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.todosLosVehiculos = data;
        this.vehiculosFiltrados = data;

        // Extraer y poblar las marcas únicas para el dropdown de filtro
        this.marcasUnicas = [...new Set(data.map(auto => auto.marca))].sort();

        console.log("Vehículos y Marcas cargados.", {
          totalVehiculos: this.todosLosVehiculos.length,
          marcas: this.marcasUnicas
        });
      },
      error: (err) => {
        console.error("Error al cargar los vehículos en el componente:", err);
      }
    });
  }

  aplicarFiltros(): void {
    let vehiculosTemp = [...this.todosLosVehiculos];

    if (this.categoriaSeleccionada) {
      vehiculosTemp = vehiculosTemp.filter(auto => auto.categoria === this.categoriaSeleccionada);
    }

    if (this.marcaSeleccionada) {
      vehiculosTemp = vehiculosTemp.filter(auto => auto.marca === this.marcaSeleccionada);
    }

    this.vehiculosFiltrados = vehiculosTemp;
    console.log(`Filtrado: ${this.vehiculosFiltrados.length} vehículos encontrados.`);
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.vehiculosFiltrados = [...this.todosLosVehiculos];
    console.log("Filtros limpiados. Mostrando todos los vehículos.");
  }
}

