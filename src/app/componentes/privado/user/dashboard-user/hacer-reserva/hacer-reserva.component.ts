import { Component } from '@angular/core';
import { VehiculosComponent } from '../../../../publico/informacion/vehiculos/vehiculos.component'

@Component({
  selector: 'app-hacer-reserva',
  standalone: true,
  imports: [
    VehiculosComponent // <-- Importamos el componente de vehículos para poder usarlo en el HTML
  ],
  templateUrl: './hacer-reserva.component.html',
  styleUrls: ['./hacer-reserva.component.css']
})
export class HacerReservaComponent {

}