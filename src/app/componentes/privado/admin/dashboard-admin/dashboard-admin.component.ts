import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  userId: string = '';

  navItems: NavItem[] = [
    { label: 'Inicio', icon: 'fas fa-home', link: 'home' },
    { label: 'Mi Cuenta', icon: 'fas fa-circle-user', link: 'mi-cuenta' },
    { label: 'Mis Reservas', icon: 'fas fa-suitcase', link: 'mis-reservas' },
    { label: 'Hacer Reserva', icon: 'fa-solid fa-car', link: 'hacer-reserva' },
    { label: 'Configuración', icon: 'fas fa-cog', link: 'configuracion' }
  ];

  constructor() {}

  ngOnInit(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.userId = usuario.userId;
    }
  }

}