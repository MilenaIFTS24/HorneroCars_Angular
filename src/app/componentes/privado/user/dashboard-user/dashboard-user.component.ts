// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeDashboardUserComponent } from './home-dashboard-user/home-dashboard-user.component';



interface NavItem {
  label: string;
  icon: string; // Clase CSS para el icono
  link: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css'], 
  imports: [RouterModule, CommonModule]
})
export class DashboardUserComponent implements OnInit {
 navItems: NavItem[] = [
  { label: 'Inicio', icon: 'fas fa-home', link: 'home' },
  { label: 'Mi Cuenta', icon: 'fas fa-circle-user', link: 'mi-cuenta' },
  { label: 'Mis Reservas', icon: 'fas fa-suitcase', link: 'mis-reservas' },
  { label: 'Hacer Reserva', icon: 'fa-solid fa-car', link: 'hacer-reserva' },
  { label: 'Configuración', icon: 'fas fa-cog', link: 'configuracion' }
];

  constructor() { }

  ngOnInit(): void {
  }
}


