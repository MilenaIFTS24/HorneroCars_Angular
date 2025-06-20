import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- agregar
import { NgbNavModule, NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../autenticacion/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbDropdownModule, RouterModule, LoginComponent], // <-- CommonModule aquí
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
 
}