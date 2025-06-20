import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from '../../autenticacion/login/login.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    NgbDropdownModule,
    RouterModule,
    LoginComponent
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  usuarioLogueado: any = null;

  constructor(
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si hay un usuario guardado en sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const usuarioJson = sessionStorage.getItem('usuario');
      if (usuarioJson) {
        this.usuarioLogueado = JSON.parse(usuarioJson);
      }
    }
  }

  abrirModalSesion(): void {
    // Abre modal de login y procesa el resultado
    const modalRef = this.modalService.open(LoginComponent, {
      size: 'md',
      centered: true
    });

    modalRef.result.then((user) => {
      if (user) {
        this.usuarioLogueado = user;
        sessionStorage.setItem('usuario', JSON.stringify(user));

        // Redirige según el rol
        if (user.rol === 'Administrador') {
          this.router.navigate(['/dashboardAdmin']);
        } else if (user.rol === 'Cliente') {
          this.router.navigate(['/dashboardUser']);
        }
      }
    }).catch(() => {
      // Modal cerrado sin iniciar sesión, no hacer nada
    });
  }

  cerrarSesion(): void {
    // Elimina la sesión y redirige al inicio
    this.usuarioLogueado = null;
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }
}
