import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../modelos/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly localStorageKey = 'appUsers';
  private readonly url = 'assets/usuarios.json';

  constructor(private http: HttpClient) {
    this.initUsuarios();
  }

  private initUsuarios(): void {
    const data = localStorage.getItem(this.localStorageKey);

    if (!data) {
      this.http.get<User[]>(this.url).subscribe({
        next: (usuarios) => {
          console.log('Usuarios cargados desde JSON:', usuarios);
          localStorage.setItem(this.localStorageKey, JSON.stringify(usuarios));
        },
        error: (err) => {
          console.error('Error cargando JSON:', err);
          localStorage.setItem(this.localStorageKey, JSON.stringify([]));
        }
      });
    } else {
      console.log('Ya hay usuarios en localStorage');
    }
  }

  getUsuarios(): Observable<User[]> {
    const stored = localStorage.getItem(this.localStorageKey);
    if (stored) {
      try {
        return of(JSON.parse(stored));
      } catch {
        return of([]);
      }
    }
    return of([]);
  }
}