import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para ngFor, ngIf, etc.
import { FormsModule } from '@angular/forms'; // Necesario para ngModel (two-way binding)
import { AbmVehiculoService } from '../../../../../servicios/abm-vehiculo.service';
import { Vehiculo } from '../../../../../modelos/vehiculo';
import { VehiculosComponent } from '../../../../publico/informacion/vehiculos/vehiculos.component';

@Component({
  selector: 'app-gestion-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa módulos necesarios para plantillas
  templateUrl: './gestion-vehiculos.component.html',
  styleUrl: './gestion-vehiculos.component.css'
})

export class GestionVehiculosComponent implements OnInit {
  // Array para almacenar los vehículos que se muestran en la tabla
  vehiculos: Vehiculo[] = [];

  // Objeto para el formulario, inicializado con valores por defecto
  // Es importante inicializar todas las propiedades anidadas como 'caracteristicas' y 'requisitos'
  vehiculoForm: Vehiculo = {
    id: 0, // El ID se generará automáticamente o se asignará al editar
    marca: '',
    modelo: '',
    categoria: '',
    descripcion_corta: '',
    precio_dia: 0,
    imagen: '', // URL de imagen vacía por defecto
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

  // Variable para controlar si estamos en modo edición o adición
  modoEdicion: boolean = false;

  // Variable para mostrar mensajes de error al usuario
  mensajeError: string = '';

  constructor(private abmVehiculoService: AbmVehiculoService) { }

  ngOnInit(): void {
    // Cuando el componente se inicializa, carga la lista de vehículos
    this.cargarVehiculos();
  }

  /**
   * Carga la lista de vehículos desde el servicio y la asigna a 'vehiculos'.
   * Maneja errores y muestra mensajes al usuario.
   */
  cargarVehiculos(): void {
    this.abmVehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.mensajeError = ''; // Limpiar mensaje de error si la carga es exitosa
      },
      error: (err) => {
        console.error('Error al cargar vehículos:', err);
        this.mensajeError = 'No se pudieron cargar los vehículos: ' + (err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Agrega un nuevo vehículo utilizando el servicio.
   * Genera un ID simple para el nuevo vehículo (considerar un generador de UUIDs en producción).
   */
  agregarVehiculo(): void {
    // Generar un ID simple basado en el timestamp actual.
    // Esto es suficiente para el manejo en localStorage.
    this.vehiculoForm.id = Date.now();

    this.abmVehiculoService.addVehiculo(this.vehiculoForm).subscribe({
      next: (vehiculo) => {
        console.log('Vehículo agregado:', vehiculo);
        this.cargarVehiculos(); // Recargar la lista para mostrar el nuevo vehículo
        this.limpiarFormulario(); // Resetear el formulario
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al agregar vehículo:', err);
        this.mensajeError = 'Error al agregar vehículo: ' + (err.message || 'Error desconocido al añadir');
      }
    });
  }

  /**
   * Prepara el formulario para editar un vehículo existente.
   * Clona el objeto para evitar modificar directamente el array 'vehiculos'.
   * @param vehiculo El vehículo a editar.
   */
  seleccionarVehiculo(vehiculo: Vehiculo): void {
    // Clonar el objeto para no modificar directamente el array 'vehiculos'
    // Asegurarse de clonar también las propiedades anidadas como 'caracteristicas' y 'requisitos'
    this.vehiculoForm = {
      ...vehiculo,
      caracteristicas: { ...vehiculo.caracteristicas },
      requisitos: { ...vehiculo.requisitos },
      tags: [...vehiculo.tags]
    };
    this.modoEdicion = true;
    this.mensajeError = '';
  }

  /**
   * Actualiza un vehículo existente utilizando los datos del formulario.
   */
  actualizarVehiculo(): void {
    this.abmVehiculoService.updateVehiculo(this.vehiculoForm).subscribe({
      next: (vehiculo) => {
        console.log('Vehículo actualizado:', vehiculo);
        this.cargarVehiculos(); // Recargar la lista para mostrar los cambios
        this.limpiarFormulario(); // Resetear el formulario
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al actualizar vehículo:', err);
        this.mensajeError = 'Error al actualizar vehículo: ' + (err.message || 'Error desconocido al actualizar');
      }
    });
  }

  /**
   * Elimina un vehículo por su ID.
   * Solicita confirmación antes de eliminar.
   * @param id El ID del vehículo a eliminar.
   */
  eliminarVehiculo(id: number): void {
    // Usar un modal personalizado en lugar de 'confirm()' en entornos de Canvas/Iframe
    // Por simplicidad, se usa 'confirm' aquí, pero se recomienda una solución UI personalizada.
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      this.abmVehiculoService.deleteVehiculo(id).subscribe({
        next: () => {
          console.log('Vehículo eliminado con éxito.');
          this.cargarVehiculos(); // Recargar la lista
          this.limpiarFormulario(); // Limpiar el formulario en caso de que el eliminado fuera el seleccionado
          this.mensajeError = '';
        },
        error: (err) => {
          console.error('Error al eliminar vehículo:', err);
          this.mensajeError = 'Error al eliminar vehículo: ' + (err.message || 'Error desconocido al eliminar');
        }
      });
    }
  }

  /**
   * Cancela el modo edición y limpia el formulario.
   */
  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  /**
   * Resetea el formulario a su estado inicial.
   */
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
    this.mensajeError = ''; // Limpiar cualquier mensaje de error pendiente del formulario
  }
}