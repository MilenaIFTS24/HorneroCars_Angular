import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'; // Re-importar PLATFORM_ID e Inject
import { isPlatformBrowser } from '@angular/common'; // Re-importar isPlatformBrowser
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Sucursal } from '../modelos/sucursal';

@Injectable({
  providedIn: 'root'
})
export class AbmSucursalesService {

  private sucursalesUrl = 'assets/data/sucursales.json';
  private localStorageKey = 'appSucursales';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID para detectar el entorno
  ) {
    /* Codigo para persistencia de datos */
    // ES CRUCIAL verificar si estamos en un navegador antes de usar localStorage
    if (isPlatformBrowser(this.platformId)) {
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
  }

  /* Traer sucursales de localStorage (para abm) */
  getSucursales(): Observable<Sucursal[]> {
    // Solo acceder a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
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
    }
    // Si no es un navegador o no hay sucursales guardadas (o hubo error al parsear), devuelve un array vacío
    return of([]);
  }

  /**
   * Añade una nueva sucursal al localStorage.
   * @param newSucursal El objeto Sucursal a añadir.
   * @returns Un Observable que emite la sucursal añadida.
   */
  addSucursal(newSucursal: Sucursal): Observable<Sucursal> {
    // Solo intentar modificar localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return this.getSucursales().pipe(
        map(sucursales => {
          // Si sucursales es nulo o indefinido (en caso de que getSucursales devuelva of([])), inicializarlo
          const currentSucursales = sucursales || [];

          if (currentSucursales.some(s => s.sucursalId === newSucursal.sucursalId)) {
            throw new Error('El ID de la sucursal ya existe.');
          }
          // Usamos codigo postal para fines practicos, pero en la realidad se puede llegar a repetir
          if (newSucursal.direccion.codigoPostal && currentSucursales.some(s => s.direccion.codigoPostal === newSucursal.direccion.codigoPostal)) {
            throw new Error('El código postal de la sucursal ya está registrado.');
          }

          const updatedSucursales = [...currentSucursales, newSucursal];
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedSucursales));
          return newSucursal;
        }),
        catchError(error => {
          console.error('Error al añadir sucursal a localStorage: ', error);
          return throwError(() => error);
        })
      );
    } else {
      // Si no es un navegador, no se puede añadir a localStorage, devuelve un error o un Observable vacío.
      console.warn('localStorage no disponible en este entorno para añadir sucursal.');
      return throwError(() => new Error('localStorage no disponible en este entorno para añadir.'));
    }
  }

  /**
   * Actualiza una sucursal existente en localStorage.
   * @param updatedSucursal El objeto Sucursal con los datos actualizados.
   * @returns Un Observable que emite la sucursal actualizada.
   */
  updateSucursal(updatedSucursal: Sucursal): Observable<Sucursal> {
    // Solo intentar modificar localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return this.getSucursales().pipe(
        map(sucursales => {
          const currentSucursales = sucursales || [];
          const index = currentSucursales.findIndex(s => s.sucursalId === updatedSucursal.sucursalId);
          if (index > -1) {
            currentSucursales[index] = updatedSucursal;
            localStorage.setItem(this.localStorageKey, JSON.stringify(currentSucursales));
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
    } else {
      console.warn('localStorage no disponible en este entorno para actualizar sucursal.');
      return throwError(() => new Error('localStorage no disponible en este entorno para actualizar.'));
    }
  }

  /**
   * Elimina una sucursal de localStorage por su ID.
   * @param sucursarId El ID de la sucursal a eliminar.
   * @returns Un Observable que se completa si la eliminación es exitosa.
   */
  deleteSucursal(sucursarId: number): Observable<void> {
    // Solo intentar modificar localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return this.getSucursales().pipe(
        map(sucursales => {
          const currentSucursales = sucursales || [];
          const lengthInicial = currentSucursales.length;
          const updatedSucursales = currentSucursales.filter(s => s.sucursalId !== sucursarId);
          if (updatedSucursales.length < lengthInicial) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(updatedSucursales));
            return; // No se emite valor, solo se completa el observable
          } else {
            throw new Error('Sucursal no encontrada para eliminar.');
          }
        }),
        catchError(error => {
          console.error('Error al eliminar sucursal de localStorage: ', error);
          return throwError(() => error);
        })
      );
    } else {
      console.warn('localStorage no disponible en este entorno para eliminar sucursal.');
      return throwError(() => new Error('localStorage no disponible en este entorno para eliminar.'));
    }
  }

  /**
   * Busca una sucursal por su ID en localStorage.
   * @param id El ID de la sucursal a buscar.
   * @returns Un Observable que emite la sucursal encontrada o `undefined` si no existe.
   */
  getSucursalById(id: number): Observable<Sucursal | undefined> {
    // Solo buscar en localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return this.getSucursales().pipe(
        map(sucursales => sucursales.find(sucursal => sucursal.sucursalId === id))
      );
    } else {
      // Si no es un navegador, no puede buscar en localStorage, devuelve undefined.
      return of(undefined);
    }
  }
}
