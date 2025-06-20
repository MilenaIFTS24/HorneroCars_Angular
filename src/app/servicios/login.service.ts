// Importaciones necesarias para el servicio
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../modelos/user';

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible a nivel global
})
export class LoginService {

  // Ruta del archivo JSON local con los usuarios (simulando una API)
  private url = 'assets/usuarios.json';

  // Inyección de HttpClient para realizar peticiones HTTP
  constructor(private http: HttpClient) {}

  // Método que retorna la lista de usuarios como observable
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }
}
