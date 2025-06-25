import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vehiculo } from '../modelos/vehiculo'; 

@Injectable({
  providedIn: 'root'
})
export class AbmVehiculoService {


  private readonly localStorageKey = 'appVehiculos';
  private readonly rutaJsonVehiculosIniciales = 'assets/vehiculos.json';

  // Almacena los vehículos una vez cargados.
  private vehiculosEnMemoria: Vehiculo[] | null = null;

  // --- Constructor del Servicio ---
  constructor(private http: HttpClient) {
    this.initVehiculos();
  }

  // Obtiene los vehículos almacenados en localStorage.
  private getVehiculosFromStorage(): Vehiculo[] | null {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Error al parsear vehículos de localStorage:', e);
      return null;
    }
  }

  // Guarda un array de vehículos en localStorage.
  private saveVehiculosToStorage(vehiculos: Vehiculo[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(vehiculos));
  }

  // --- Lógica de Inicialización de Vehículos ---

  // Inicializa los vehículos: intenta cargarlos desde localStorage.
  // Si no hay, los carga desde un archivo JSON predefinido y los guarda.
  private initVehiculos(): void {
    const storedVehiculos = this.getVehiculosFromStorage();

    if (!storedVehiculos) {
      // Si no hay vehículos en localStorage, los carga desde el JSON
      this.http.get<{ vehiculos: Vehiculo[] }>(this.rutaJsonVehiculosIniciales).subscribe({
        next: (response) => {
          this.vehiculosEnMemoria = response.vehiculos;
          this.saveVehiculosToStorage(response.vehiculos);
          console.log('Vehículos iniciales cargados desde assets/vehiculos.json a localStorage y memoria.');
        },
        error: (err) => {
          console.error('Error al cargar vehículos iniciales:', err);
          this.vehiculosEnMemoria = [];
          this.saveVehiculosToStorage([]);
        }
      });
    } else {
      // Si ya hay vehículos en localStorage, los carga a la caché en memoria
      this.vehiculosEnMemoria = storedVehiculos;
      console.log('Vehículos cargados desde localStorage a memoria.');
    }
  }

  // Obtiene todos los vehículos.
  getVehiculos(): Observable<Vehiculo[]> {
    if (this.vehiculosEnMemoria) {
      return of(this.vehiculosEnMemoria);
    }

    // intenta cargar desde localStorage
    const vehiculos = this.getVehiculosFromStorage();
    if (vehiculos) {
      this.vehiculosEnMemoria = vehiculos;
      return of(vehiculos);
    }
    return of([]);
  }

  // Agregar vehículo
  addVehiculo(newVehiculo: Vehiculo): Observable<Vehiculo> {
    const vehiculos = this.getVehiculosFromStorage() || [];

    // Valida si el ID del vehículo ya existe.
    if (vehiculos.some(v => v.id === newVehiculo.id)) {
      return throwError(() => new Error('El ID del vehículo ya existe.'));
    }
    // Valida si la matrícula ya está registrada.
    if (newVehiculo.caracteristicas && vehiculos.some(v => v.caracteristicas?.matricula === newVehiculo.caracteristicas?.matricula)) {
      return throwError(() => new Error('La matrícula del vehículo ya está registrada.'));
    }

    // Agrega el nuevo vehículo y actualiza el almacenamiento.
    const vehiculosActualizados = [...vehiculos, newVehiculo];
    this.saveVehiculosToStorage(vehiculosActualizados);
    this.vehiculosEnMemoria = vehiculosActualizados;

    return of(newVehiculo); // Retorna el vehículo agregado.
  }

  // Actualiza un vehículo existente por su ID.
  actualizarVehiculo(vehiculoParaActualizar: Vehiculo): Observable<Vehiculo> {
    const vehiculos = this.getVehiculosFromStorage() || [];
    const index = vehiculos.findIndex(v => v.id === vehiculoParaActualizar.id);

    if (index > -1) {
      // Si lo encuentra, lo actualiza y guarda los cambios.
      vehiculos[index] = vehiculoParaActualizar;
      this.saveVehiculosToStorage(vehiculos);
      this.vehiculosEnMemoria = vehiculos;
      return of(vehiculoParaActualizar);
    } else {
      return throwError(() => new Error('Vehículo no encontrado para actualizar.'));
    }
  }

  // Elimina un vehículo por su ID.
  eliminarVehiculo(vehiculoId: number): Observable<void> {
    const vehiculos = this.getVehiculosFromStorage() || [];
    const initialLength = vehiculos.length;
    // Filtra el array para excluir el vehículo a eliminar.
    const vehiculosActualizados = vehiculos.filter(v => v.id !== vehiculoId);

    if (vehiculosActualizados.length < initialLength) {
      // Si se eliminó un vehículo, guarda los cambios.
      this.saveVehiculosToStorage(vehiculosActualizados);
      this.vehiculosEnMemoria = vehiculosActualizados;
      return of(undefined);
    } else {
      return throwError(() => new Error('Vehículo no encontrado para eliminar.'));
    }
  }

  // Busca un vehículo por su ID.
  getVehiculoById(id: number): Observable<Vehiculo | undefined> {
    // Obtiene todos los vehículos y busca el que coincida con el ID.
    return this.getVehiculos().pipe( 
      map(vehiculos => vehiculos.find(vehiculo => vehiculo.id === id))
    );
  }
}