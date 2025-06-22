import { Component } from '@angular/core';
import { ContactoComponent } from "./contacto/contacto.component";
import { VehiculosComponent } from "./vehiculos/vehiculos.component";

@Component({
  selector: 'app-informacion',
  imports: [ContactoComponent, VehiculosComponent],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent {

}
