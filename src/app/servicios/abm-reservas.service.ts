import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Reserva } from '../modelos/reserva';

@Injectable({
  providedIn: 'root'
})
export class AbmReservaService {

  private readonly localStorageKey = 'appReservas';
  private readonly initialReservasJsonPath = 'assets/reservas.json';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedReservas = localStorage.getItem(this.localStorageKey);
      if (!storedReservas) {
        this.http.get<{ reservas: Reserva[] }>(this.initialReservasJsonPath).pipe(
          tap(response => {
            localStorage.setItem(this.localStorageKey, JSON.stringify(response.reservas));
            console.log('Reservas iniciales cargadas desde assets/reservas.json a localStorage.');
          }),
          catchError(error => {
            console.error('Error al cargar reservas iniciales:', error);
            localStorage.setItem(this.localStorageKey, JSON.stringify([]));
            return of({ reservas: [] });
          })
        ).subscribe();
      } else {
        console.log('Reservas cargadas desde localStorage.');
      }
    } else {
      console.log('AbmReservaService inicializado en entorno de servidor.');
    }
  }

  getReservas(): Observable<Reserva[]> {
    if (isPlatformBrowser(this.platformId)) {
      const reservasJson = localStorage.getItem(this.localStorageKey);
      if (reservasJson) {
        try {
          const reservas: Reserva[] = JSON.parse(reservasJson);
          return of(reservas);
        } catch (e) {
          console.error('Error al parsear reservas de localStorage:', e);
          return throwError(() => new Error('Error al cargar reservas.'));
        }
      }
      return of([]);
    } else {
      return of([]);
    }
  }

  addReserva(newReserva: Reserva): Observable<Reserva> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getReservas().pipe(
        map(reservas => {
          if (reservas.some(r => r.reservaId === newReserva.reservaId)) {
            throw new Error('El ID de la reserva ya existe.');
          }

          const updatedReservas = [...reservas, newReserva];
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedReservas));
          return newReserva;
        }),
        catchError(error => {
          console.error('Error al añadir reserva a localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }

  updateReserva(updatedReserva: Reserva): Observable<Reserva> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getReservas().pipe(
        map(reservas => {
          const index = reservas.findIndex(r => r.reservaId === updatedReserva.reservaId);
          if (index > -1) {
            reservas[index] = updatedReserva;
            localStorage.setItem(this.localStorageKey, JSON.stringify(reservas));
            return updatedReserva;
          } else {
            throw new Error('Reserva no encontrada para actualizar.');
          }
        }),
        catchError(error => {
          console.error('Error al actualizar reserva:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }

  deleteReserva(reservaId: number): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getReservas().pipe(
        map(reservas => {
          const initialLength = reservas.length;
          const updatedReservas = reservas.filter(r => r.reservaId !== reservaId);
          if (updatedReservas.length < initialLength) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(updatedReservas));
            return;
          } else {
            throw new Error('Reserva no encontrada para eliminar.');
          }
        }),
        catchError(error => {
          console.error('Error al eliminar reserva:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }

  getReservaById(id: number): Observable<Reserva | undefined> {
    return this.getReservas().pipe(
      map(reservas => reservas.find(reserva => reserva.reservaId === id))
    );
  }
}
