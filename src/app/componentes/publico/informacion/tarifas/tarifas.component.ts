import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarifas',
  imports: [],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.css'
})
export class TarifasComponent {
  
  @Output() alertaEnConstruccion = new EventEmitter<void>(); 

  alertarEnConstruccion() {
    this.alertaEnConstruccion.emit();
    console.log("Enviando alerta");
  }
}
