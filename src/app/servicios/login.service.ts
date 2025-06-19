import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../modelos/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = 'assets/usuarios.json';
 constructor(private http: HttpClient) {}

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }
}
