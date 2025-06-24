
import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/publico/home/home.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { RegistroComponent } from './componentes/autenticacion/registro/registro.component';
import { DashboardAdminComponent } from './componentes/privado/admin/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './componentes/privado/user/dashboard-user/dashboard-user.component';
import { ContactoComponent } from './componentes/publico/informacion/contacto/contacto.component';
import { InformacionComponent } from './componentes/publico/informacion/informacion.component';
import { ReservaComponent } from './componentes/publico/reserva/reserva.component';
import { GestionSucursalesComponent } from './componentes/privado/admin/dashboard-admin/admin-gestion-sucursales/admin-gestion-sucursales.component';
import { HomeDashboardUserComponent } from './componentes/privado/user/dashboard-user/home-dashboard-user/home-dashboard-user.component';

export const routes: Routes = [ //rutas elaboradas con lazy loading.
  { path: "", loadComponent: () => import('./componentes/publico/home/home.component').then(m => HomeComponent) },
  { path: "login", loadComponent: () => import('./componentes/autenticacion/login/login.component').then(m => LoginComponent) },
  { path: "registro", loadComponent: () => import('./componentes/autenticacion/registro/registro.component').then(m => RegistroComponent) },


  { path: "contacto", loadComponent: () => import('./componentes/publico/informacion/contacto/contacto.component').then(m => ContactoComponent) },
  { path: "informacion", loadComponent: () => import('./componentes/publico/informacion/informacion.component').then(m => InformacionComponent) },
  { path: "reserva", loadComponent: () => import('./componentes/publico/reserva/reserva.component').then(m => ReservaComponent) },


  { path: "dashboardUser", loadComponent: () => import('./componentes/privado/user/dashboard-user/home-dashboard-user/home-dashboard-user.component').then(m => HomeDashboardUserComponent) },
  { path: "dashboardAdmin", loadComponent: () => import('./componentes/privado/admin/dashboard-admin/dashboard-admin.component').then(m => DashboardAdminComponent) },



  {
    path: "informacion",
    loadComponent: () => import('./componentes/publico/informacion/informacion.component').then(m => m.InformacionComponent),
    children: [
      {
        path: 'vehiculos', // URL final: /informacion/vehiculos
        loadComponent: () => import('./componentes/publico/informacion/vehiculos/vehiculos.component').then(m => m.VehiculosComponent)
      },
      {
        path: 'tarifas', // URL final: /informacion/tarifas
        loadComponent: () => import('./componentes/publico/informacion/tarifas/tarifas.component').then(m => m.TarifasComponent)
      },
      {
        path: 'contacto', // URL final: /informacion/contacto
        loadComponent: () => import('./componentes/publico/informacion/contacto/contacto.component').then(m => m.ContactoComponent)
      },
      {
        path: '', // Si solo se navega a /informacion, redirigir a vehículos
        redirectTo: 'vehiculos',
        pathMatch: 'full'
      }
    ]
  },




  {
    path: "dashboardAdmin",
    loadComponent: () => import('./componentes/privado/admin/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
    children: [

      {
        path: "gestion-sucursales",
        loadComponent: () =>
          import('./componentes/privado/admin/dashboard-admin/admin-gestion-sucursales/admin-gestion-sucursales.component')
            .then(m => m.GestionSucursalesComponent)
      },
      {
        path: "gestion-vehiculos",
        loadComponent: () =>
          import('./componentes/privado/admin/dashboard-admin/gestion-vehiculos/gestion-vehiculos.component')
            .then(m => m.GestionVehiculosComponent)
      },
      {
        path: "gestion-reservas",
        loadComponent: () =>
          import('./componentes/privado/admin/dashboard-admin/gestion-reservas/gestion-reservas.component')
            .then(m => m.GestionReservasComponent)
      },
    ]
  },




  {

    path: "dashboardUser",
    loadComponent: () =>
      import('./componentes/privado/user/dashboard-user/dashboard-user.component')
        .then(m => m.DashboardUserComponent),
    children: [
      {
        path: "home",
        loadComponent: () =>
          import('./componentes/privado/user/dashboard-user/home-dashboard-user/home-dashboard-user.component')
            .then(m => m.HomeDashboardUserComponent)
      },

      {
        path: 'mi-cuenta',
        loadComponent: () => import('./componentes/privado/user/dashboard-user/home-dashboard-user/home-dashboard-user.component').then(m => m.HomeDashboardUserComponent)
      },
      {
        // RUTA HIJA: /dashboardUser/mis-reservas
        path: 'mis-reservas',
        // RUTA DE ARCHIVO: La ubicación física del nuevo componente hijo
        loadComponent: () => import('./componentes/privado/user/dashboard-user/mis-reservas/mis-reservas.component').then(m => m.MisReservasComponent)
      },
      {
        path: 'hacer-reserva',
        loadComponent: () => import('./componentes/privado/user/dashboard-user/hacer-reserva/hacer-reserva.component').then(m => m.HacerReservaComponent)
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./componentes/privado/user/dashboard-user/home-dashboard-user/home-dashboard-user.component').then(m => m.HomeDashboardUserComponent)
      },


      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      }
    ]
  },


  { path: '', redirectTo: '/', pathMatch: 'full' },
];
