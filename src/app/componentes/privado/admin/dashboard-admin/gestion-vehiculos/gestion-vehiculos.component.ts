import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel (two-way binding)
import { AbmVehiculoService } from '../../../../../servicios/abm-vehiculo.service';
import { Vehiculo } from '../../../../../modelos/vehiculo';

@Component({
  selector: 'app-gestion-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-vehiculos.component.html',
  styleUrls: ['./gestion-vehiculos.component.css']
})
export class GestionVehiculosComponent implements OnInit {
  vehiculos: Vehiculo[] = []; // Todos los vehículos cargados del servicio
  vehiculosFiltrados: Vehiculo[] = []; // Vehículos que se muestran en la tabla después de aplicar filtros

  vehiculoForm: Vehiculo = {
    id: 0,
    marca: '',
    modelo: '',
    categoria: '',
    descripcion_corta: '',
    precio_dia: 0,
    imagen: '',
    disponible: true,
    caracteristicas: {
      puertas: 0,
      plazas: 0,
      transmision: '',
      maletero: '',
      grupo: '',
      matricula: '',
    },
    tags: [],
    requisitos: {
      edad_minima: 0
    }
  };

  filtroMarca: string = '';
  filtroModelo: string = '';
  filtroCategoria: string = '';
  filtroMatricula: string = '';
  filtroDisponible: string = 'todos'; // 'todos', 'true', 'false'

  modoEdicion: boolean = false;
  mensajeError: string = '';

  constructor(private abmVehiculoService: AbmVehiculoService) { }

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  /* Carga todos los vehículos del servicio y luego aplica los filtros iniciales.*/
  cargarVehiculos(): void {
    this.abmVehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.aplicarFiltros(); //  Aplica los filtros después de cargar todos los vehículos
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.mensajeError = 'No se pudieron cargar los vehículos: ' + (err.message || 'Error desconocido');
      }
    });
  }

  /* Aplica los criterios de filtro a la lista completa de vehículos.*/
  aplicarFiltros(): void {
    let tempVehiculos = [...this.vehiculos]; // Trabaja con una copia para no modificar el original

    if (this.filtroMarca) {
      tempVehiculos = tempVehiculos.filter(v =>
        v.marca.toLowerCase().includes(this.filtroMarca.toLowerCase())
      );
    }
    if (this.filtroModelo) {
      tempVehiculos = tempVehiculos.filter(v =>
        v.modelo.toLowerCase().includes(this.filtroModelo.toLowerCase())
      );
    }
    if (this.filtroCategoria) {
      tempVehiculos = tempVehiculos.filter(v =>
        v.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())
      );
    }
    if (this.filtroMatricula) {
      tempVehiculos = tempVehiculos.filter(v =>
        v.caracteristicas?.matricula?.toLowerCase().includes(this.filtroMatricula.toLowerCase())
      );
    }

    if (this.filtroDisponible !== 'todos') {
      const isDisponible = this.filtroDisponible === 'true';
      tempVehiculos = tempVehiculos.filter(v => v.disponible === isDisponible);
    }

    this.vehiculosFiltrados = tempVehiculos; //  Asigna el resultado filtrado a la lista que se muestra
  }

  /* Limpia todos los campos de filtro y vuelve a aplicar los filtros (mostrando todos). */
  limpiarFiltros(): void {
    this.filtroMarca = '';
    this.filtroModelo = '';
    this.filtroCategoria = '';
    this.filtroMatricula = '';
    this.filtroDisponible = 'todos';
    this.aplicarFiltros(); //  Vuelve a aplicar los filtros para refrescar la tabla
  }

  agregarVehiculo(): void {
//  Validamos que no haya campos vacios
 if (!this.vehiculoForm.marca?.trim() ||
      !this.vehiculoForm.modelo?.trim() ||
      !this.vehiculoForm.categoria?.trim() ||
      !this.vehiculoForm.precio_dia || 
      !this.vehiculoForm.imagen?.trim() ||
      !this.vehiculoForm.caracteristicas?.matricula?.trim() || 
      !this.vehiculoForm.caracteristicas?.puertas ||
      !this.vehiculoForm.caracteristicas?.plazas ||
      !this.vehiculoForm.caracteristicas?.transmision?.trim() ||
      !this.vehiculoForm.caracteristicas?.maletero?.trim() ||
      !this.vehiculoForm.caracteristicas?.grupo?.trim())
  {
    this.mensajeError = 'Todos los campos obligatorios del vehículo (Marca, Modelo, Categoría, Precio por Día, Imagen, y detalles de Características como Matrícula, Puertas, Plazas, Transmisión, Maletero, Grupo) deben estar completos.';
    return;
  }
    this.vehiculoForm.id = Date.now();

    this.abmVehiculoService.addVehiculo(this.vehiculoForm).subscribe({
      next: (vehiculo) => {
        console.log('Vehículo agregado:', vehiculo);
        this.cargarVehiculos(); // Recargar todos y aplicar filtros
        this.limpiarFormulario();
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al agregar vehículo:', err);
        this.mensajeError = 'Error al agregar vehículo: ' + (err.message || 'Error desconocido al añadir');
      }
    });
  }

  seleccionarVehiculo(vehiculo: Vehiculo): void {
    this.vehiculoForm = {
      ...vehiculo,
      caracteristicas: { ...vehiculo.caracteristicas },
      requisitos: { ...vehiculo.requisitos },
      tags: [...vehiculo.tags]
    };
    this.modoEdicion = true;
    this.mensajeError = '';
  }

  actualizarVehiculo(): void {
    this.abmVehiculoService.actualizarVehiculo(this.vehiculoForm).subscribe({
      next: (vehiculo) => {
        console.log('Vehículo actualizado:', vehiculo);
        this.cargarVehiculos(); // Recargar todos y aplicar filtros
        this.limpiarFormulario();
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al actualizar vehículo:', err);
        this.mensajeError = 'Error al actualizar vehículo: ' + (err.message || 'Error desconocido al actualizar');
      }
    });
  }

  eliminarVehiculo(id: number): void {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.abmVehiculoService.eliminarVehiculo(id).subscribe({
        next: () => {
          console.log('Vehículo eliminado con éxito.');
          this.cargarVehiculos(); // Recargar todos y aplicar filtros
          this.limpiarFormulario();
          this.mensajeError = '';
        },
        error: (err) => {
          console.error('Error al eliminar vehículo:', err);
          this.mensajeError = 'Error al eliminar vehículo: ' + (err.message || 'Error desconocido al eliminar');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.vehiculoForm = {
      id: 0,
      marca: '',
      modelo: '',
      categoria: '',
      descripcion_corta: '',
      precio_dia: 0,
      imagen: '',
      disponible: true,
      caracteristicas: {
        puertas: 0,
        plazas: 0,
        transmision: '',
        maletero: '',
        grupo: '',
        matricula: ''
      },
      tags: [],
      requisitos: {
        edad_minima: 0
      }
    };
    this.modoEdicion = false;
    this.mensajeError = '';
  }
}