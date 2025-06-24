import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbmSucursalesService } from '../../../../../servicios/abm-sucursales.service';
import { Sucursal } from '../../../../../modelos/sucursal';

@Component({
  selector: 'app-gestion-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-gestion-sucursales.component.html', 
  styleUrls: ['./admin-gestion-sucursales.component.css'] 
})
export class GestionSucursalesComponent implements OnInit {
  sucursales: Sucursal[] = []; // Todas las sucursales cargadas del servicio
  sucursalesFiltradas: Sucursal[] = []; // Sucursales que se muestran en la tabla después de aplicar filtros


  sucursalForm: Sucursal = {
    sucursalId: 0,
    direccion: {
      direccionId: 0,
      calleNombre: '',
      calleAltura: '',
      codigoPostal: '',
      provincia: '',
      localidad: ''
    },
    telefono: 0
  };

  // Variables de filtro para sucursales
  filtroProvincia: string = '';
  filtroLocalidad: string = '';
  filtroCodigoPostal: string = '';

  modoEdicion: boolean = false; // Indica si estamos en modo edición o agregando
  mensajeError: string = ''; // Mensajes de error para el usuario

  // Para la confirmación de eliminación
  mostrarConfirmacionEliminar: boolean = false;
  sucursalAEliminarId: number | null = null;

  constructor(private abmSucursalesService: AbmSucursalesService) { }

  ngOnInit(): void {
    this.cargarSucursales(); // Carga las sucursales al inicializar el componente
  }

  /**
   * Carga todas las sucursales del servicio y luego aplica los filtros iniciales.
   */
  cargarSucursales(): void {
    this.abmSucursalesService.getSucursales().subscribe({
      next: (data) => {
        this.sucursales = data; // Almacena todas las sucursales
        this.aplicarFiltros(); // Aplica los filtros actuales (o ninguno si no hay)
        this.mensajeError = ''; // Limpia cualquier mensaje de error anterior
      },
      error: (err) => {
        console.error('Error al cargar sucursales:', err);
        this.mensajeError = 'No se pudieron cargar las sucursales: ' + (err.message || 'Error desconocido');
      }
    });
  }

  /**
   * Aplica los criterios de filtro a la lista completa de sucursales.
   * Actualiza la lista de `sucursalesFiltradas`.
   */
  aplicarFiltros(): void {
    let tempSucursales = [...this.sucursales]; // Trabaja con una copia para no modificar el array original

    if (this.filtroProvincia) {
      tempSucursales = tempSucursales.filter(s =>
        s.direccion.provincia.toLowerCase().includes(this.filtroProvincia.toLowerCase())
      );
    }
    if (this.filtroLocalidad) {
      tempSucursales = tempSucursales.filter(s =>
        s.direccion.localidad.toLowerCase().includes(this.filtroLocalidad.toLowerCase())
      );
      console.log('Filtro por localidad...')
    }
    if (this.filtroCodigoPostal) {
      tempSucursales = tempSucursales.filter(s =>
        s.direccion.codigoPostal.toLowerCase().includes(this.filtroCodigoPostal.toLowerCase())
      );
    }

    this.sucursalesFiltradas = tempSucursales; // Asigna el resultado filtrado a la lista que se muestra
  }

  /**
   * Limpia todos los campos de filtro y vuelve a aplicar los filtros (mostrando todas las sucursales).
   */
  limpiarFiltros(): void {
    this.filtroProvincia = '';
    this.filtroLocalidad = '';
    this.filtroCodigoPostal = '';
    this.aplicarFiltros(); // Vuelve a aplicar los filtros para refrescar la tabla
  }

  /**
   * Añade una nueva sucursal utilizando los datos del formulario.
   */
  agregarSucursal(): void {
    // Asigna un ID único a la nueva sucursal (ej. timestamp)
    this.sucursalForm.sucursalId = Date.now();

    this.abmSucursalesService.addSucursal(this.sucursalForm).subscribe({
      next: (sucursal) => {
        console.log('Sucursal agregada:', sucursal);
        this.cargarSucursales(); // Recarga todas las sucursales y aplica filtros
        this.limpiarFormulario(); // Resetea el formulario
        this.mensajeError = ''; // Limpia mensaje de error
      },
      error: (err) => {
        console.error('Error al agregar sucursal:', err);
        this.mensajeError = 'Error al agregar sucursal: ' + (err.message || 'Error desconocido al añadir');
      }
    });
  }

  /**
   * Selecciona una sucursal para editar, precargando el formulario.
   * @param sucursal El objeto Sucursal a editar.
   */
  seleccionarSucursal(sucursal: Sucursal): void {
    // Realiza una copia profunda para evitar modificar el objeto original directamente.
    // Solo se copia la propiedad 'direccion' de forma profunda, ya que es el único objeto anidado en el modelo actual.
    // 'telefono' y 'sucursalId' son primitivos y se copian por valor con el operador spread.
    this.sucursalForm = {
      ...sucursal,
      direccion: { ...sucursal.direccion }
    };
    this.modoEdicion = true; // Activa el modo edición
    this.mensajeError = ''; // Limpia mensaje de error
  }

  /**
   * Actualiza una sucursal existente utilizando los datos del formulario.
   */
  actualizarSucursal(): void {
    this.abmSucursalesService.updateSucursal(this.sucursalForm).subscribe({
      next: (sucursal) => {
        console.log('Sucursal actualizada:', sucursal);
        this.cargarSucursales(); // Recarga todas las sucursales y aplica filtros
        this.limpiarFormulario(); // Resetea el formulario
        this.mensajeError = ''; // Limpia mensaje de error
      },
      error: (err) => {
        console.error('Error al actualizar sucursal:', err);
        this.mensajeError = 'Error al actualizar sucursal: ' + (err.message || 'Error desconocido al actualizar');
      }
    });
  }

  /**
   * Inicia el proceso de eliminación, mostrando el modal de confirmación.
   * @param id El ID de la sucursal a eliminar.
   */
  eliminarSucursal(id: number): void {
    this.sucursalAEliminarId = id;
    this.mostrarConfirmacionEliminar = true; // Muestra el modal/mensaje de confirmación
  }

  /**
   * Confirma la eliminación de la sucursal.
   */
  confirmarEliminar(): void {
    if (this.sucursalAEliminarId !== null) {
      this.abmSucursalesService.deleteSucursal(this.sucursalAEliminarId).subscribe({
        next: () => {
          console.log('Sucursal eliminada con éxito.');
          this.cargarSucursales(); // Recarga todas las sucursales y aplica filtros
          this.limpiarFormulario(); // Resetea el formulario
          this.mensajeError = ''; // Limpia mensaje de error
        },
        error: (err) => {
          console.error('Error al eliminar sucursal:', err);
          this.mensajeError = 'Error al eliminar sucursal: ' + (err.message || 'Error desconocido al eliminar');
        }
      });
      this.cancelarEliminar(); // Cierra el modal de confirmación
    }
  }

  /**
   * Cancela la eliminación y oculta el modal de confirmación.
   */
  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.sucursalAEliminarId = null;
  }

  /**
   * Cancela el modo edición y resetea el formulario.
   */
  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  /**
   * Resetea el formulario de sucursal a sus valores iniciales y sale del modo edición.
   */
  limpiarFormulario(): void {
    this.sucursalForm = {
      sucursalId: 0,
      direccion: { // Resetear dirección al modelo inicial
        direccionId: 0,
        calleNombre: '',
        calleAltura: '',
        codigoPostal: '',
        provincia: '',
        localidad: ''
      },
      telefono: 0 // Resetear teléfono a 0
    };    
    this.modoEdicion = false; // Desactiva el modo edición
    this.mensajeError = ''; // Limpia mensaje de error
  }
}