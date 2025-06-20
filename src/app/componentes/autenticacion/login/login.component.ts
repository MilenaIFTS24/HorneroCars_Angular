import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../servicios/login.service';
import { User } from '../../../modelos/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 userId: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private loginService: LoginService,
    public activeModal: NgbActiveModal
  ) {}

  iniciarSesion() {
    this.loginService.getUsuarios().subscribe((usuarios: User[]) => {
      const user = usuarios.find(
        u => u.userId === this.userId && u.password === this.password
      );

      if (user) {
        sessionStorage.setItem('usuario', JSON.stringify(user));
        this.activeModal.close(user);
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }

  cerrarModal() {
    this.activeModal.dismiss();
  }
}
