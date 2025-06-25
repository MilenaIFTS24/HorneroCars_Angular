import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, throwError } from 'rxjs'; 
import { Sucursal } from '../modelos/sucursal';

@Injectable({
  providedIn: 'root'
})
export class AbmSucursalesService {

  private sucursalesUrl = 'assets/data/sucursales.json';
  private localStorageKey = 'appSucursales';

  // Caché en memoria para almacenar las sucursales una vez cargadas
  private sucursalesInMemory: Sucursal[] | null = null;

  constructor(
    private http: HttpClient
  ) {
    this.initSucursales(); 
  }

  // Lógica de inicialización de sucursales, llamada desde el constructor.
  private initSucursales(): void {
    /* Codigo para persistencia de datos */
    // ES CRUCIAL verificar si estamos en un navegador antes de usar localStorage
    const storedSucursales = localStorage.getItem(this.localStorageKey);
    if (!storedSucursales) {
      this.http.get<{ sucursales: Sucursal[] }>(this.sucursalesUrl).subscribe({
        next: (respuesta) => {
          this.sucursalesInMemory = respuesta.sucursales; // Asignar a la caché en memoria
          localStorage.setItem(this.localStorageKey, JSON.stringify(respuesta.sucursales));
          console.log('Sucursales iniciales cargadas desde assets/data/sucursales.json a localStorage.');
        },
        error: (error) => {
          console.error('Error al cargar sucursales iniciales desde assets/data/sucursales.json:', error);
          /* si falla la carga del json, inicializa localStorage con un array vacio */
          this.sucursalesInMemory = []; // Inicializar caché en caso de error
          localStorage.setItem(this.localStorageKey, JSON.stringify([]));
          /* Retorna un observable(of) con un objeto que contiene un array vacio */ 
        }
      });
    } else {
      this.sucursalesInMemory = JSON.parse(storedSucursales); // Cargar desde localStorage a la caché
      console.log('Sucursales cargadas desde localStorage.');
    }
  }

  /* Traer sucursales de localStorage (para abm) */
  getSucursales(): Observable<Sucursal[]> {
    if (this.sucursalesInMemory) { // Se asume que si está en memoria, ya viene de localStorage o del JSON inicial
      return of(this.sucursalesInMemory);
    }

    const sucursalesLocal = localStorage.getItem(this.localStorageKey);
    if (sucursalesLocal) {
      try {
        const sucursales: Sucursal[] = JSON.parse(sucursalesLocal);
        this.sucursalesInMemory = sucursales; // Llenar la caché si se carga desde localStorage
        return of(sucursales);
      } catch (error) {
        console.error('Error al parsear sucursales de localStorage: ', error);
        return throwError(() => new Error('Error al cargar sucursales.'));
      }
    }
    // Si no es un navegador o no hay sucursales guardadas (o hubo error al parsear), devuelve un array vacío
    return of([]);
  }

  /* Añade una nueva sucursal al localStorage. */
  addSucursal(newSucursal: Sucursal): Observable<Sucursal> {
    // Solo intentar modificar localStorage si estamos en el navegador
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
        this.sucursalesInMemory = updatedSucursales; // Actualizar la caché
        return newSucursal;
      })
    );
  }

  /* Actualiza una sucursal existente en localStorage. */
  updateSucursal(updatedSucursal: Sucursal): Observable<Sucursal> {

    // Solo intentar modificar localStorage si estamos en el navegador
    return this.getSucursales().pipe(
      map(sucursales => {
        const currentSucursales = sucursales || [];
        const index = currentSucursales.findIndex(s => s.sucursalId === updatedSucursal.sucursalId);
        if (index > -1) {
          currentSucursales[index] = updatedSucursal;
          localStorage.setItem(this.localStorageKey, JSON.stringify(currentSucursales));
          this.sucursalesInMemory = currentSucursales;
          return updatedSucursal;
        } else {
          throw new Error('Sucursal no encontrada para actualizar.');
        }
      })
    );
  }

  /* Elimina una sucursal de localStorage por su ID. */
  deleteSucursal(sucursarId: number): Observable<void> {
    // Solo intentar modificar localStorage si estamos en el navegador
    return this.getSucursales().pipe(
      map(sucursales => {
        const currentSucursales = sucursales || [];
        const lengthInicial = currentSucursales.length;
        const updatedSucursales = currentSucursales.filter(s => s.sucursalId !== sucursarId);
        if (updatedSucursales.length < lengthInicial) {
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedSucursales));
          this.sucursalesInMemory = updatedSucursales; // Actualizar la caché
          return; // No se emite valor, solo se completa el observable
        } else {
          throw new Error('Sucursal no encontrada para eliminar.');
        }
      })
    );
  }

  /*Busca una sucursal por su ID en localStorage.*/
  getSucursalById(id: number): Observable<Sucursal | undefined> {
    // Solo buscar en localStorage si estamos en el navegador
    return this.getSucursales().pipe(
      map(sucursales => sucursales.find(sucursal => sucursal.sucursalId === id))
    );
  }
}