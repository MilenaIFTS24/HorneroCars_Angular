import { Component } from '@angular/core';

@Component({
  selector: 'app-tarifas',
  imports: [],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.css'
})
export class TarifasComponent {

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
  }

  /* Método en desuso */
  irAContacto() {
    const formContacto = document.getElementById('formContacto');
    if (formContacto) {
      formContacto.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('El formulario con ID "formContacto" no fue encontrado en el DOM.');
    }
  }

}
