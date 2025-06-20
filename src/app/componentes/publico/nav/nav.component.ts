import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- agregar
import { NgbNavModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../autenticacion/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbDropdownModule, RouterModule, LoginComponent], // <-- CommonModule aquí
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  usuarioLogueado: any = null;

  constructor(private modalService: NgbModal, private router: Router ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const usuarioJson = sessionStorage.getItem('usuario');
      if (usuarioJson) {
        this.usuarioLogueado = JSON.parse(usuarioJson);
      }
    }
  }

  abrirModalSesion() {
  const modalRef = this.modalService.open(LoginComponent, { size: 'md', centered: true });
  modalRef.result.then((user) => {
    if (user) {
      this.usuarioLogueado = user;
      sessionStorage.setItem('usuario', JSON.stringify(user));

      // Redirigir según rol
      if (user.rol === 'Administrador') {
        this.router.navigate(['/dashboardAdmin']);
      } else if (user.rol === 'Cliente') {
        this.router.navigate(['/dashboardUser']);
      }
    }
  }).catch(() => {});
}

  cerrarSesion() {
    this.usuarioLogueado = null;
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/'])
  }
}