import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/publico/home/home.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { RegistroComponent } from './componentes/autenticacion/registro/registro.component';
import { DashboardAdminComponent } from './componentes/privado/admin/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './componentes/privado/user/dashboard-user/dashboard-user.component';
import { ContactoComponent } from './componentes/publico/informacion/contacto/contacto.component';
import { InformacionComponent } from './componentes/publico/informacion/informacion.component';
import { ReservaComponent } from './componentes/publico/reserva/reserva.component';

export const routes: Routes = [ //rutas elaboradas con lazy loading.
  { path: "", loadComponent: () => import('./componentes/publico/home/home.component').then(m => HomeComponent) },
  { path: "login", loadComponent: () => import('./componentes/autenticacion/login/login.component').then(m => LoginComponent) },
  { path: "registro", loadComponent: () => import('./componentes/autenticacion/registro/registro.component').then(m => RegistroComponent) },
  { path: "dashboardAdmin", loadComponent: () => import('./componentes/privado/admin/dashboard-admin/dashboard-admin.component').then(m => DashboardAdminComponent) },
  { path: "contacto", loadComponent: () => import('./componentes/publico/informacion/contacto/contacto.component').then(m => ContactoComponent) },
  { path: "informacion", loadComponent: () => import('./componentes/publico/informacion/informacion.component').then(m => InformacionComponent) },
  { path: "reserva", loadComponent: () => import('./componentes/publico/reserva/reserva.component').then(m => ReservaComponent) },

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
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      }
    ]
  },


  {
  path: "dashboardAdmin",
  loadComponent: () => import('./componentes/privado/admin/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent),
  children: [
    
    {
      path: "gestion-reservas",
      loadComponent: () =>
        import('./componentes/privado/admin/dashboard-admin/gestion-reservas/gestion-reservas.component')
          .then(m => m.GestionReservasComponent)
    },
    {
      path: "",
      redirectTo: "gestion-vehiculos",
      pathMatch: "full"
    }
  ]
},

  { path: '', redirectTo: '/', pathMatch: 'full' },
];