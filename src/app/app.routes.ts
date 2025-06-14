import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/public/home/home.component';
import { LoginComponent } from './componentes/autenticacion/login/login.component';
import { RegistroComponent } from './componentes/autenticacion/registro/registro.component';
import { DashboardAdminComponent } from './componentes/private/admin/dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from './componentes/private/user/dashboard-user/dashboard-user.component';
import { ContactoComponent } from './componentes/public/contacto/contacto.component';
import { InformacionComponent } from './componentes/public/informacion/informacion.component';
import { ReservaComponent } from './componentes/public/reserva/reserva.component';

export const routes: Routes = [ //rutas elaboradas con lazy loading.
    { path: "", loadComponent: () => import('./componentes/public/home/home.component').then(m => HomeComponent) },
    { path: "login", loadComponent: () => import('./componentes/autenticacion/login/login.component').then(m => LoginComponent) },
    { path: "registro", loadComponent: () => import('./componentes/autenticacion/registro/registro.component').then(m => RegistroComponent) },
    { path: "dashboardAdmin", loadComponent: () => import('./componentes/private/admin/dashboard-admin/dashboard-admin.component').then(m => DashboardAdminComponent) },
    { path: "dashboardUser", loadComponent: () => import('./componentes/private/user/dashboard-user/dashboard-user.component').then(m => DashboardUserComponent) },
    { path: "contacto", loadComponent: () => import('./componentes/public/contacto/contacto.component').then(m => ContactoComponent) },
    { path: "informacion", loadComponent: () => import('./componentes/public/informacion/informacion.component').then(m => InformacionComponent) },
    { path: "reserva", loadComponent: () => import('./componentes/public/reserva/reserva.component').then(m => ReservaComponent) },
    { path:'**', redirectTo: '/' } //en caso de no existir la ruta escrita, redirige al home.
];
