import { Component } from '@angular/core';
import { TarifasComponent } from './tarifas/tarifas.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informacion',
  imports: [TarifasComponent, RouterLink, CommonModule],
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
