import { Component } from '@angular/core';
import { ContactoComponent } from "./contacto/contacto.component";
import { VehiculosComponent } from "./vehiculos/vehiculos.component";
import { TarifasComponent } from './tarifas/tarifas.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-informacion',
  imports: [TarifasComponent, ContactoComponent, VehiculosComponent, RouterLink, CommonModule],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent {
  alertaVisible: boolean = false;

  mostrarEnConstruccion() {
    this.alertaVisible = true;
    setTimeout(() => {
      const alertaElement = document.getElementById('alertaEnConstruccion');
      if (alertaElement) {
        alertaElement.scrollIntoView({
          behavior: 'smooth', // scrolleo suave
          block: 'center'    // centrar la alerta
        });
      }
    }, 10);/* delay */
    console.log("Alerta visible")
  }
  ocultarAlertaEnConstruccion() {
    this.alertaVisible = false;
    console.log("Ocultando alerta")
  }
}
