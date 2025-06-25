import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Reserva } from '../modelos/reserva'; // Asumimos que tienes un modelo/interfaz para 'Reserva'

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  // La clave que usamos para guardar el array de reservas en el almacenamiento local del navegador.
  private readonly localStorageKey = 'reservas';

  constructor() { }

  /**
   * Lee todas las reservas guardadas en localStorage.
   * @returns Un Observable que emite un array de todas las reservas.
   */
  getReservas(): Observable<Reserva[]> {
    const reservasStr = localStorage.getItem(this.localStorageKey);
    const reservas = reservasStr ? JSON.parse(reservasStr) : [];
    return of(reservas); // 'of()' convierte el array en un Observable simple.
  }

  /**
   * Guarda el array completo de reservas en localStorage.
   * @param reservas - El array completo de reservas a guardar.
   */
  private guardarReservas(reservas: Reserva[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(reservas));
  }

   /* Añade una nueva reserva al listado existente en localStorage.
   * @param nuevaReserva - El objeto de la nueva reserva que se va a guardar.
   */
  agregarReserva(nuevaReserva: Reserva): void {
    this.getReservas().subscribe(reservasActuales => {
      // Añadimos la nueva reserva al principio del array para que aparezca primero.
      const reservasActualizadas = [nuevaReserva, ...reservasActuales];
      // Guardamos el array actualizado en localStorage.
      this.guardarReservas(reservasActualizadas);
      console.log('Servicio: Nueva reserva agregada con éxito.', nuevaReserva);
    });
  }


  /**
   * Cambia el estado de una reserva específica a "Cancelada".
   * @param reservaId - El ID de la reserva que se quiere cancelar.
   */
  cancelarReserva(reservaId: string): void {
    this.getReservas().subscribe(reservas => {
      const index = reservas.findIndex(r => r.reservaId === reservaId);
      if (index !== -1) {
        reservas[index].estado = "Cancelada";
        this.guardarReservas(reservas); // Guarda el array actualizado.
        console.log(`Servicio: Reserva ${reservaId} ha sido cancelada.`);
      }
    });
  }
}

