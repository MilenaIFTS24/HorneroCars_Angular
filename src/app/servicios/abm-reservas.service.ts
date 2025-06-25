import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservaAbm } from '../modelos/reserva-abm';

@Injectable({
  providedIn: 'root'
})
export class AbmReservaService {

  // --- Propiedades de Configuración ---
  private readonly localStorageKey = 'appReservas';
  private readonly rutaJsonReservasIniciales = 'assets/reservas.json';

  // Almacena las reservas una vez cargadas para un acceso rápido.
  private reservasEnMemoria: ReservaAbm[] | null = null;

  // --- Constructor del Servicio ---
  constructor(private http: HttpClient) {
    this.initReservas();
  }

  // Obtiene las reservas almacenadas en localStorage.
  private getReservasFromStorage(): ReservaAbm[] | null {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error al parsear reservas de localStorage:', e);
      return null;
    }
  }

  // Guarda un array de reservas en localStorage.
  private saveReservasToStorage(reservas: ReservaAbm[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(reservas));
  }

  // --- Lógica de Inicialización de Reservas ---

  // Inicializa las reservas: intenta cargarlas desde localStorage.
  // Si no hay, las carga desde un archivo JSON predefinido y las guarda.
  private initReservas(): void {
    const storedReservas = this.getReservasFromStorage();

    if (!storedReservas) {
      // Si no hay reservas en localStorage, las carga desde el JSON
      this.http.get<{ reservas: ReservaAbm[] }>(this.rutaJsonReservasIniciales).subscribe({
        next: (response) => {
          this.reservasEnMemoria = response.reservas;
          this.saveReservasToStorage(response.reservas);
          console.log('Reservas iniciales cargadas desde assets/reservas.json a localStorage y memoria.');
        },
        error: (err) => {
          console.error('Error al cargar reservas iniciales:', err);
          this.reservasEnMemoria = [];
          this.saveReservasToStorage([]);
        }
      });
    } else {
      // Si ya hay reservas en localStorage, las carga a la caché en memoria
      this.reservasEnMemoria = storedReservas;
      console.log('Reservas cargadas desde localStorage a memoria.');
    }
  }


  // Obtiene todas las reservas.
  getReservas(): Observable<ReservaAbm[]> {
    if (this.reservasEnMemoria) {
      return of(this.reservasEnMemoria);
    }

    // intenta cargar desde localStorage 
    const reservas = this.getReservasFromStorage();
    if (reservas) {
      this.reservasEnMemoria = reservas;
      return of(reservas);
    }
    return of([]); // Si no hay datos, devuelve un array vacío.
  }

  // Añade una nueva reserva, con validación de ID.
  addReserva(newReserva: ReservaAbm): Observable<ReservaAbm> {
    const reservas = this.getReservasFromStorage() || [];

    // Valida si el ID de la reserva ya existe.
    if (reservas.some(r => r.reservaId === newReserva.reservaId)) {
      return throwError(() => new Error('El ID de la reserva ya existe.'));
    }

    // Agrega la nueva reserva y actualiza el almacenamiento.
    const reservasActualizadas = [...reservas, newReserva];
    this.saveReservasToStorage(reservasActualizadas);
    this.reservasEnMemoria = reservasActualizadas;

    return of(newReserva); // Retorna la reserva añadida.
  }

  // Actualiza una reserva existente por su ID.
  actualizarReserva(reservaParaActualizar: ReservaAbm): Observable<ReservaAbm> {
    const reservas = this.getReservasFromStorage() || [];
    const index = reservas.findIndex(r => r.reservaId === reservaParaActualizar.reservaId);

    if (index > -1) {
      // Si la encuentra, la actualiza y guarda los cambios.
      reservas[index] = reservaParaActualizar;
      this.saveReservasToStorage(reservas);
      this.reservasEnMemoria = reservas;
      return of(reservaParaActualizar);
    } else {
      return throwError(() => new Error('Reserva no encontrada para actualizar.'));
    }
  }

  // Elimina una reserva por su ID.
  eliminarReserva(reservaId: number): Observable<void> {
    const reservas = this.getReservasFromStorage() || [];
    const initialLength = reservas.length;
    // Filtra el array para excluir la reserva a eliminar.
    const reservasActualizadas = reservas.filter(r => r.reservaId !== reservaId);

    if (reservasActualizadas.length < initialLength) {
      // Si se eliminó una reserva, guarda los cambios.
      this.saveReservasToStorage(reservasActualizadas);
      this.reservasEnMemoria = reservasActualizadas;
      return of(undefined);
    } else {
      return throwError(() => new Error('Reserva no encontrada para eliminar.'));
    }
  }

  // Busca una reserva por su ID.
  getReservaById(id: number): Observable<ReservaAbm | undefined> {
    // Obtiene todas las reservas y busca la que coincida con el ID.
    return this.getReservas().pipe(
      map(reservas => reservas.find(reserva => reserva.reservaId === id))
    );
  }
}