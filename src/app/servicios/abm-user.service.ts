// src/app/servicios/abm-user.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importa Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators'; // No necesitas switchMap aquí para localStorage

import { User } from '../modelos/user';

@Injectable({
  providedIn: 'root'
})
export class AbmUserService {

  private readonly localStorageKey = 'appUsers';
  private readonly initialUsersJsonPath = 'assets/usuarios.json';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID
  ) {
    // Solo intentar cargar desde localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem(this.localStorageKey);
      if (!storedUsers) {
        // Carga inicial del JSON si localStorage está vacío
        this.http.get<User[]>(this.initialUsersJsonPath).pipe(
          tap(initialUsers => {
            localStorage.setItem(this.localStorageKey, JSON.stringify(initialUsers));
            console.log('Usuarios iniciales cargados desde assets/usuarios.json a localStorage.');
          }),
          catchError(error => {
            console.error('Error al cargar usuarios iniciales desde assets/usuarios.json:', error);
            // Si falla la carga inicial del JSON, inicializa localStorage con un array vacío
            localStorage.setItem(this.localStorageKey, JSON.stringify([]));
            return of([]); // Retorna un observable vacío para que la cadena no se rompa
          })
        ).subscribe();
      } else {
        console.log('Usuarios cargados desde localStorage.');
      }
    } else {
      console.log('AbmUserService inicializado en entorno de servidor (no se accede a localStorage).');
      // Podrías inicializar `users` con un array vacío o manejar de otra forma
      // para que getUsuarios no falle si se llama desde el servidor.
    }
  }

  // Los métodos getUsuarios, addUser, etc. también necesitan esta verificación
  // ya que son llamados en el servicio.

  getUsuarios(): Observable<User[]> {
    if (isPlatformBrowser(this.platformId)) {
      const usersJson = localStorage.getItem(this.localStorageKey);
      if (usersJson) {
        try {
          const users: User[] = JSON.parse(usersJson);
          return of(users);
        } catch (e) {
          console.error('Error al parsear usuarios de localStorage:', e);
          return throwError(() => new Error('Error al cargar usuarios.'));
        }
      }
      return of([]); // Si no hay usuarios en localStorage, devuelve un array vacío
    } else {
      // Si no estamos en el navegador, devuelve un Observable de array vacío o error
      // dependiendo de tu lógica de SSR. Para este caso, un array vacío es seguro.
      return of([]);
    }
  }

  addUser(newUser: User): Observable<User> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getUsuarios().pipe(
        map(users => {
          // Opcional: Validar si el userId o email ya existe (ejemplo básico)
          if (users.some(u => u.userId === newUser.userId)) {
            throw new Error('El ID de usuario ya existe.');
          }
          if (users.some(u => u.email === newUser.email)) {
            throw new Error('El email ya está registrado.');
          }

          const updatedUsers = [...users, newUser];
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUsers));
          return newUser;
        }),
        catchError(error => {
          console.error('Error al añadir usuario a localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      // Si no estamos en el navegador, no podemos guardar en localStorage
      // Puedes lanzar un error o devolver un observable vacío/simulado
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }

  // Repite la misma lógica de `if (isPlatformBrowser(this.platformId))`
  // para `updateUser` y `deleteUser` si los usas.
  updateUser(updatedUser: User): Observable<User> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getUsuarios().pipe(
        map(users => {
          const index = users.findIndex(u => u.userId === updatedUser.userId);
          if (index > -1) {
            users[index] = updatedUser;
            localStorage.setItem(this.localStorageKey, JSON.stringify(users));
            return updatedUser;
          } else {
            throw new Error('Usuario no encontrado para actualizar.');
          }
        }),
        catchError(error => {
          console.error('Error al actualizar usuario en localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }

  deleteUser(userId: string): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      return this.getUsuarios().pipe(
        map(users => {
          const initialLength = users.length;
          const updatedUsers = users.filter(u => u.userId !== userId);
          if (updatedUsers.length < initialLength) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUsers));
            return;
          } else {
            throw new Error('Usuario no encontrado para eliminar.');
          }
        }),
        catchError(error => {
          console.error('Error al eliminar usuario de localStorage:', error);
          return throwError(() => error);
        })
      );
    } else {
      return throwError(() => new Error('localStorage no disponible en este entorno.'));
    }
  }
}
