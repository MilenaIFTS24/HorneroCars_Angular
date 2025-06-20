import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Se define la "forma" de los datos de una oficina.
export interface Oficina {
  id: string;
  nombre: string;
  ciudad: string;
  provincia: string;
  direccion: string;
  telefono: string;
  horario: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OficinasService {

  // La ruta debe ser 'assets/oficinas.json'.
  // Angular sabe dónde encontrar la carpeta 'assets' desde la raíz de la aplicación.
  private oficinasUrl = 'assets/oficinas.json'; 

  // Se inyecta HttpClient para hacer peticiones web.
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista completa de oficinas desde el archivo JSON.
   */
  getOficinas(): Observable<Oficina[]> {
    // Hacemos la petición GET a la URL correcta.
    return this.http.get<Oficina[]>(this.oficinasUrl);
  }
}