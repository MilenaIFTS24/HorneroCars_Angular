import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Sucursal } from '../modelos/sucursal';

@Injectable({
  providedIn: 'root'
})
export class AbmSucursalesService {

  private sucursalesUrl = 'assets/data/sucursales.json';
  private localStorageKey = 'appSucursales';

  constructor(private http: HttpClient) {
    /* Codigo para persistencia de datos */
    const storedSucursales = localStorage.getItem(this.localStorageKey);
    if (!storedSucursales) {
      /* pipe() para poder aplicar el tap() y otros operadores */
      this.http.get<{ sucursales: Sucursal[] }>(this.sucursalesUrl).pipe(
        /* tap() para realizar efectos secundarios sin modificar el flujo de datos del observable(http get) */
        tap(respuesta => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(respuesta.sucursales));
          console.log('Sucursales iniciales cargadas desde assets/data/sucursales.json a localStorage.');
        }),
        catchError(error => {
          console.error('Error al cargar sucursales iniciales desde assets/data/sucursales.json:', error);
          /* si falla la carga del json, inicializa localStorage con un array vacio */
          localStorage.setItem(this.localStorageKey, JSON.stringify([]));
          return of({ sucursales: [] }); /* Retorna un observable(of) con un objeto que contiene un array vacio */
        })
      ).subscribe();
    } else {
      console.log('Sucursales cargadas desde localStorage.');
    }
  }

  /* Traer sucursales de localStorage (para abm) */
  getSucursales(): Observable<Sucursal[]> {
    const sucursalesLocal = localStorage.getItem(this.localStorageKey);
    if (sucursalesLocal) {
      try {
        const sucursales: Sucursal[] = JSON.parse(sucursalesLocal);
        return of(sucursales);
      } catch (error) {
        console.error('Error al parsear sucursales de localStorage: ', error);
        return throwError(() => new Error('Error al cargar sucursales.'));
      }
    }
    return of([]); /* si no hay sucursales, devuelve un array vacio */
  }

  addSucursal(newSucursal: Sucursal): Observable<Sucursal> {
    return this.getSucursales().pipe(
      map(sucursales => {
        if (sucursales.some(s => s.sucursalId === newSucursal.sucursalId)) {
          throw new Error('El ID de la sucursal ya existe.');
        }
        if (newSucursal.direccion.codigoPostal && sucursales.some(s => s.direccion.codigoPostal === newSucursal.direccion.codigoPostal))/* Usamos codigo postal para fines practicos, pero en la realidad se puede llegar a repetir */ {
          throw new Error('El código postal de la sucursal ya está registrado.');
        }

        const updatedSucursales = [...sucursales, newSucursal];
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedSucursales));
        return newSucursal;
      }),
      catchError(error => {
        console.error('Error al añadir sucursal a localStorage: ', error);
        return throwError(() => error);
      })
    );
  }

  updateSucursal(updatedSucursal: Sucursal): Observable<Sucursal> {
    return this.getSucursales().pipe(
      map(sucursales => {
        const index = sucursales.findIndex(s => s.sucursalId === updatedSucursal.sucursalId);
        if (index > -1) {
          sucursales[index] = updatedSucursal;
          localStorage.setItem(this.localStorageKey, JSON.stringify(sucursales));
          return updatedSucursal;
        } else {
          throw new Error('Sucursal no encontrada para actualizar.');
        }
      }),
      catchError(error => {
        console.error('Error al actualizar sucursal en localStorage: ', error);
        return throwError(() => error);
      })
    );
  }

  deleteSucursal(sucursarId: number): Observable<void> {
    return this.getSucursales().pipe(
      map(sucursales => {
        const lengthInicial = sucursales.length;
        const updatedSucursales = sucursales.filter(s => s.sucursalId !== sucursarId);
        if (updatedSucursales.length < lengthInicial) {
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedSucursales));
          return;
        } else {
          throw new Error('Sucursal no encontrada para eliminar.');
        }
      }),
      catchError(error => {
        console.error('Error al eliminar vehiculo de localStorage: ', error);
        return throwError(() => error);
      })
    );
  }

  getSucursalById(id: number): Observable<Sucursal | undefined> {
    return this.getSucursales().pipe(
      map(sucursales => sucursales.find(sucursal => sucursal.sucursalId === id))
    );
  }

}
