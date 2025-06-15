import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// La interfaz define la "forma" de un objeto Vehículo para mayor seguridad de tipos.
export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  categoria: string;
  descripcion_corta: string;
  precio_dia: number;
  imagen: string;
  disponible: boolean;
  caracteristicas: {
    puertas: number;
    plazas: number;
    transmision: string;
    maletero: string;
    grupo: string;
    matricula: string;
  };
  tags: string[];
  requisitos: {
    edad_minima: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  // La ruta a nuestro archivo JSON dentro de la carpeta 'assets'.
  // Esta ruta es relativa a la raíz del sitio cuando se sirve.
  private vehiculosUrl = 'assets/vehiculos.json'; 

  // Inyectamos el HttpClient de Angular, la herramienta para hacer peticiones web.
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista completa de vehículos desde el archivo JSON.
   * Devuelve un Observable que emite un array de objetos Vehiculo.
   */
  getVehiculos(): Observable<Vehiculo[]> {
    // Hacemos una petición GET al archivo JSON.
    // El <{ vehiculos: Vehiculo[] }> le dice a TypeScript qué forma esperamos que tenga la respuesta del JSON.
    return this.http.get<{ vehiculos: Vehiculo[] }>(this.vehiculosUrl).pipe(
      // Usamos el operador 'map' de RxJS para transformar la respuesta.
      // En lugar de devolver todo el objeto { vehiculos: [...] },
      // extraemos y devolvemos solo el array que está dentro de la propiedad 'vehiculos'.
      map(response => response.vehiculos)
    );
  }
}

