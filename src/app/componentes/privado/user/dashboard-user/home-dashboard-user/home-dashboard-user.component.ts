import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../../../modelos/user';

@Component({
  selector: 'app-home-dashboard-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-dashboard-user.component.html',
  styleUrls: ['./home-dashboard-user.component.css']
})
export class HomeDashboardUserComponent implements OnInit {

  public usuarioLogueado: User | null = null;

  constructor() { }

  ngOnInit(): void {
    // CORRECCIÓN: Leemos la clave correcta 'usuario' que guarda el LoginComponent
    const usuarioActivoStr = sessionStorage.getItem('usuario');

    if (usuarioActivoStr) {
      this.usuarioLogueado = JSON.parse(usuarioActivoStr);
    } else {
      console.warn('Home Dashboard: No se encontró un usuario activo en la sesión.');
    }
  }

  openChatBot(): void {
    console.log('Abriendo el chat con el bot...');
  }
}