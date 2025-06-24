import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../../servicios/login.service';
import { User } from '../../../modelos/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userId: string = '';
  password: string = '';

  usuarioIncorrecto: boolean = false;
  passwordIncorrecto: boolean = false;

  constructor(
    private loginService: LoginService,
    public activeModal: NgbActiveModal
  ) { }

  iniciarSesion() {
    this.usuarioIncorrecto = false;
    this.passwordIncorrecto = false;

    this.loginService.getUsuarios().subscribe((usuarios: User[]) => {
      // Buscamos un usuario cuyo userId o email coincida con lo ingresado
      const user = usuarios.find(
        u =>
          (u.userId === this.userId || u.email === this.userId) &&
          u.password === this.password
      );

      if (user) {
        sessionStorage.setItem('usuario', JSON.stringify(user));
        this.activeModal.close(user);
      } else {
        // Si no encontró usuario con userId/email
        const userExistente = usuarios.find(
          u => u.userId === this.userId || u.email === this.userId
        );

        if (!userExistente) {
          // Usuario/email incorrecto
          this.usuarioIncorrecto = true;
        } else {
          // Usuario/email correcto pero password incorrecto
          this.passwordIncorrecto = true;
        }
      }
    });
  }

  cerrarModal() {
    this.activeModal.dismiss();
  }
}