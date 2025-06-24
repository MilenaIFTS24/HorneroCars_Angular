import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importa Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Vehiculo } from '../modelos/vehiculo'; //  Importamos el modelo Vehiculo

@Injectable({
  providedIn: 'root'
})
export class AbmVehiculoService { 

  private readonly localStorageKey = 'appVehiculos'; //  Clave para localStorage cambiada a 'appVehiculos'
  private readonly initialVehiculosJsonPath = 'assets/vehiculos.json'; //  Ruta al JSON inicial cambiada a 'assets/vehiculos.json'

    constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID
  ) {
    // Solo intentar cargar desde localStorage si estamos en el navegador (para SSR)
    if (isPlatformBrowser(this.platformId)) {
      const storedVehiculos = localStorage.getItem(this.localStorageKey);
      if (!storedVehiculos) {
        // Carga inicial del JSON si localStorage está vacío
        this.http.get<{ vehiculos: Vehiculo[] }>(this.initialVehiculosJsonPath).pipe( // Ajuste para el array anidado "vehiculos"
          tap(response => {
            localStorage.setItem(this.localStorageKey, JSON.stringify(response.vehiculos)); // Guarda solo el array de vehiculos
            console.log('Vehículos iniciales cargados desde assets/vehiculos.json a localStorage.');
          }),
          catchError(error => {
            console.error('Error al cargar vehículos iniciales desde assets/vehiculos.json:', error);
            // Si falla la carga inicial del JSON, inicializa localStorage con un array vacío
            localStorage.setItem(this.localStorageKey, JSON.stringify([]));
            return of({ vehiculos: [] }); // Retorna un observable con un objeto que contiene un array vacío
          })
        ).subscribe();
      } else {
        console.log('Vehículos cargados desde localStorage.');
      }
    } else {
      console.log('AbmVehiculoService inicializado en entorno de servidor (no se accede a localStorage).');
      // En entorno de servidor, los métodos de obtención de datos deberían manejar
      // un array vacío o un origen de datos alternativo.
    }
  }

  /**
   * Obtiene todos los vehículos del localStorage.
   * Si no estamos en el navegador, devuelve un array vacío.
   * @returns Un Observable que emite un array de objetos Vehiculo.
   */
  getVehiculos(): Observable<Vehiculo[]> {
    if (isPlatformBrowser(this.platformId)) {
      const vehiculosJson = localStorage.getItem(this.localStorageKey);
      if (vehiculosJson) {
        try {
          const vehiculos: Vehiculo[] = JSON.parse(vehiculosJson);
          return of(vehiculos);
        } catch (e) {
          console.error('Error al parsear vehículos de localStorage:', e);
          return throwError(() => new Error('Error al cargar vehículos.'));
        }
      }
      return of([]); // Si no hay vehículos en localStorage, devuelve un array vacío
    } else {
      // En entorno de servidor, no hay localStorage, se devuelve un array vacío.
      return of([]);
    }
  }

  /**
   * Añade un nuevo vehículo al localStorage.
   * @param newVehiculo El objeto Vehiculo a añadir.
   * @returns Un Observable que emite el vehículo añadido.
   */
  addVehiculo(newVehiculo: Vehiculo): Observable<Vehiculo> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getVehiculos().pipe(
        map(vehiculos => {
          //  Validación: Verifica si ya existe un vehículo con el mismo ID o Matrícula
          // Asumiendo que 'id' es un identificador único y 'matricula' es otro campo único.
          if (vehiculos.some(v => v.id === newVehiculo.id)) {
            throw new Error('El ID del vehículo ya existe.');
          }
          if (newVehiculo.caracteristicas && vehiculos.some(v => v.caracteristicas?.matricula === newVehiculo.caracteristicas?.matricula)) {
            throw new Error('La matrícula del vehículo ya está registrada.');
          }

          const updatedVehiculos = [...vehiculos, newVehiculo];
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedVehiculos));
          return newVehiculo;
        }),
        catchError(error => {
          console.error('Error al añadir vehículo a localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno para añadir.'));
    }
  }

  /**
   * Actualiza un vehículo existente en el localStorage.
   * @param updatedVehiculo El objeto Vehiculo con los datos actualizados.
   * @returns Un Observable que emite el vehículo actualizado.
   */
  updateVehiculo(updatedVehiculo: Vehiculo): Observable<Vehiculo> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getVehiculos().pipe(
        map(vehiculos => {
          //  Busca el vehículo por su ID para actualizarlo
          const index = vehiculos.findIndex(v => v.id === updatedVehiculo.id);
          if (index > -1) {
            vehiculos[index] = updatedVehiculo; // Reemplaza el vehículo existente
            localStorage.setItem(this.localStorageKey, JSON.stringify(vehiculos));
            return updatedVehiculo;
          } else {
            throw new Error('Vehículo no encontrado para actualizar.');
          }
        }),
        catchError(error => {
          console.error('Error al actualizar vehículo en localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno para actualizar.'));
    }
  }

  /**
   * Elimina un vehículo del localStorage por su ID.
   * @param vehiculoId El ID del vehículo a eliminar.
   * @returns Un Observable que se completa sin valor si la eliminación es exitosa.
   */
  deleteVehiculo(vehiculoId: number): Observable<void> { //  Recibe vehiculoId como número
    if (isPlatformBrowser(this.platformId)) {
      return this.getVehiculos().pipe(
        map(vehiculos => {
          const initialLength = vehiculos.length;
          //  Filtra el vehículo a eliminar por su ID
          const updatedVehiculos = vehiculos.filter(v => v.id !== vehiculoId);
          if (updatedVehiculos.length < initialLength) { // Si se eliminó un vehículo
            localStorage.setItem(this.localStorageKey, JSON.stringify(updatedVehiculos));
            return; // No retorna valor al ser 'void'
          } else {
            throw new Error('Vehículo no encontrado para eliminar.');
          }
        }),
        catchError(error => {
          console.error('Error al eliminar vehículo de localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno para eliminar.'));
    }
  }

  /**
   * Busca un vehículo por su ID.
   * @param id El ID del vehículo a buscar.
   * @returns Un Observable que emite el Vehiculo encontrado o undefined si no existe.
   */
  getVehiculoById(id: number): Observable<Vehiculo | undefined> { //  Recibe id como número
    return this.getVehiculos().pipe(
      map(vehiculos => vehiculos.find(vehiculo => vehiculo.id === id))
    );
  }
}