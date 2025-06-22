import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    { label: 'Mi Cuenta', icon: 'fa-regular fa-id-card', link: 'mi-cuenta' },
    { label: 'Gestión reservas', icon: 'fa-solid fa-user-plus', link: '' },
    { label: 'Gestión vehículos', icon: 'fa-solid fa-truck', link: '' },
    { label: 'Gestión sucursales', icon: 'fa-solid fa-building', link: '' },
    { label: 'Consultas y Reportes', icon: 'fa-solid fa-chart-line', link: '' },
    { label: 'Configuracion', icon: 'fas fa-cog', link: 'configuracion' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioString = sessionStorage.getItem('usuario');
      if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        this.userId = usuario.userId;
        console.log(this.userId);
      }
    }
  }
}
