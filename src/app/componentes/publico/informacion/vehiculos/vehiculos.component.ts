
// Importamos las herramientas necesarias de Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';   //<-- IMPORTANTE: Importa CommonModule
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Añadir para [(ngModel)]
import { VehiculosService, Vehiculo } from '../../../../servicios/vehiculos.service';  // Importamos el servicio

@Component({
  selector: 'app-vehiculos',
  standalone: true,  // Indica que este componente gestiona sus propias dependencias
  imports: [
    CommonModule,
    FormsModule // <-- IMPORTANTE: Añadir aquí también
  ],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  // Propiedades para guardar las listas de vehículos
  private todosLosVehiculos: Vehiculo[] = []; // Guarda la lista original y completa
  public vehiculosFiltrados: Vehiculo[] = []; // La lista que se muestra en pantalla

  // Propiedades para los filtros
  public marcasUnicas: string[] = [];
  public categoriaSeleccionada: string = '';
  public marcaSeleccionada: string = '';

  // Inyectamos nuestro VehiculosService en el constructor
  constructor(private vehiculosService: VehiculosService) { }

  // Este método se ejecuta una vez cuando el componente se inicializa
  ngOnInit(): void {
    console.log("VehiculosComponent: Cargando vehículos...");

    // Usamos el servicio para obtener los datos
    this.vehiculosService.getVehiculos().subscribe({
      next: (data) => {
        this.todosLosVehiculos = data;
        this.vehiculosFiltrados = data; // Al inicio, la lista filtrada es igual a la completa

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

  /**
   * Se ejecuta cada vez que el usuario cambia un filtro.
   * Filtra la lista completa de vehículos y actualiza la lista que se muestra.
   */

  aplicarFiltros(): void {
    // Empezamos con una copia de todos los vehículos
    let vehiculosTemp = [...this.todosLosVehiculos];

    // Aplicamos el filtro de categoría si hay una seleccionada
    if (this.categoriaSeleccionada) {
      vehiculosTemp = vehiculosTemp.filter(auto => auto.categoria === this.categoriaSeleccionada);
    }

    // Aplicamos el filtro de marca si hay una seleccionada
    if (this.marcaSeleccionada) {
      vehiculosTemp = vehiculosTemp.filter(auto => auto.marca === this.marcaSeleccionada);
    }

    // Actualizamos la lista que se muestra en el HTML
    this.vehiculosFiltrados = vehiculosTemp;
    console.log(`Filtrado: ${this.vehiculosFiltrados.length} vehículos encontrados.`);
  }

  /**
   * Resetea los filtros y muestra todos los vehículos de nuevo.
   */
  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.vehiculosFiltrados = [...this.todosLosVehiculos];
    console.log("Filtros limpiados. Mostrando todos los vehículos.");
  }
}

