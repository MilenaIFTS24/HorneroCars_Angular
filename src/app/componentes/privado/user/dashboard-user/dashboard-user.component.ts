import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../../modelos/user';

// Definimos la estructura de los ítems de navegación
interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {

  // Propiedad para guardar al usuario logueado
  public usuarioLogueado: User | null = null;

  // Items del menú de navegación
  navItems: NavItem[] = [
    { label: 'Inicio', icon: 'fas fa-home', link: 'home' },
    { label: 'Mi Cuenta', icon: 'fas fa-circle-user', link: 'mi-cuenta' },
    { label: 'Mis Reservas', icon: 'fas fa-suitcase', link: 'mis-reservas' },
    { label: 'Hacer Reserva', icon: 'fa-solid fa-car', link: 'hacer-reserva' },
    { label: 'Configuración', icon: 'fas fa-cog', link: 'configuracion' }
  ];

  constructor() { }

  ngOnInit(): void {
    // CORRECCIÓN: Leemos la clave correcta 'usuario' que guarda el LoginComponent
    const usuarioActivoStr = sessionStorage.getItem('usuario'); 

    if (usuarioActivoStr) {
      this.usuarioLogueado = JSON.parse(usuarioActivoStr);
    }
  }
}