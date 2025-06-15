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
    { path: "dashboardUser", loadComponent: () => import('./componentes/privado/user/dashboard-user/dashboard-user.component').then(m => DashboardUserComponent) },
    { path: "contacto", loadComponent: () => import('./componentes/publico/informacion/contacto/contacto.component').then(m => ContactoComponent) },
    { path: "informacion", loadComponent: () => import('./componentes/publico/informacion/informacion.component').then(m => InformacionComponent) },
    { path: "reserva", loadComponent: () => import('./componentes/publico/reserva/reserva.component').then(m => ReservaComponent) },
    { path: "vehiculos", loadComponent: () => import('./componentes/publico/informacion/vehiculos/vehiculos.component').then(m => m.VehiculosComponent) },

    { path: '**', redirectTo: '/' } //en caso de no existir la ruta escrita, redirige al home.
];
