import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Necesario para routerLink, routerLinkActive y router-outlet
  ],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent {
  // La lógica de la alerta ya no es necesaria aquí,
  // pero la dejamos por si se usa para otras cosas en el futuro.
  alertaVisible: boolean = false;

  mostrarEnConstruccion() {
    this.alertaVisible = true;
  }

  ocultarAlertaEnConstruccion() {
    this.alertaVisible = false;
  }
}