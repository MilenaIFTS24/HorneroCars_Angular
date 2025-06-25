import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel y formularios
import { AbmReservaService } from '../../../../../servicios/abm-reservas.service';
import { ReservaAbm } from '../../../../../modelos/reserva-abm';

@Component({
  selector: 'app-gestion-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-reservas.component.html',
  styleUrls: ['./gestion-reservas.component.css']
})
export class GestionReservasComponent implements OnInit {
  reservas: ReservaAbm[] = [];
  reservasFiltradas: ReservaAbm[] = [];

  reservaForm: ReservaAbm = {
    reservaId: 0,
    clienteId: '',
    vehiculoId: 0,
    seniaPagada: false,
    precioTotal: 0,
    fechaRecogida: '',
    horaRecogida: '',
    fechaDevolucion: '',
    horaDevolucion: ''
  };

  modoEdicion: boolean = false;
  mensajeError: string = '';

  constructor(private abmReservaService: AbmReservaService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.abmReservaService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.reservasFiltradas = [...this.reservas];
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.mensajeError = 'No se pudieron cargar las reservas: ' + (err.message || 'Error desconocido');
      }
    });
  }

  agregarReserva(): void {


    if (!this.reservaForm.clienteId?.trim() ||
      !this.reservaForm.vehiculoId || // Asumiendo que 0 o null no son válidos para vehiculoId
      !this.reservaForm.precioTotal || // Asumiendo que 0 o null no son válidos para precioTotal
      !this.reservaForm.fechaRecogida?.trim() ||
      !this.reservaForm.horaRecogida?.trim() ||
      !this.reservaForm.fechaDevolucion?.trim() ||
      !this.reservaForm.horaDevolucion?.trim())
  {
    this.mensajeError = 'Todos los campos obligatorios de la reserva (ID Cliente, ID Vehículo, Precio Total, Fecha y Hora de Recogida, Fecha y Hora de Devolución) deben estar completos.';
    return;
  }
    this.reservaForm.reservaId = Date.now();

    this.abmReservaService.addReserva(this.reservaForm).subscribe({
      next: (reserva) => {
        console.log('Reserva agregada:', reserva);
        this.cargarReservas();
        this.limpiarFormulario();
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al agregar reserva:', err);
        this.mensajeError = 'Error al agregar reserva: ' + (err.message || 'Error desconocido');
      }
    });
  }

  seleccionarReserva(reserva: ReservaAbm): void {
    this.reservaForm = { ...reserva };
    this.modoEdicion = true;
    this.mensajeError = '';
  }

  actualizarReserva(): void {
    this.abmReservaService.actualizarReserva(this.reservaForm).subscribe({
      next: (reserva) => {
        console.log('Reserva actualizada:', reserva);
        this.cargarReservas();
        this.limpiarFormulario();
        this.mensajeError = '';
      },
      error: (err) => {
        console.error('Error al actualizar reserva:', err);
        this.mensajeError = 'Error al actualizar reserva: ' + (err.message || 'Error desconocido');
      }
    });
  }

  eliminarReserva(id: number): void {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.abmReservaService.eliminarReserva(id).subscribe({
        next: () => {
          console.log('Reserva eliminada con éxito.');
          this.cargarReservas();
          this.limpiarFormulario();
          this.mensajeError = '';
        },
        error: (err) => {
          console.error('Error al eliminar reserva:', err);
          this.mensajeError = 'Error al eliminar reserva: ' + (err.message || 'Error desconocido');
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.reservaForm = {
      reservaId: 0,
      clienteId: '',
      vehiculoId: 0,
      seniaPagada: false,
      precioTotal: 0,
      fechaRecogida: '',
      horaRecogida: '',
      fechaDevolucion: '',
      horaDevolucion: ''
    };
    this.modoEdicion = false;
    this.mensajeError = '';
  }
}