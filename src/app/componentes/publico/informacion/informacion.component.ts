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

}