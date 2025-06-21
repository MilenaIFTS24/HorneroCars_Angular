import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

interface AutoCarrousel {
  rutaImagen: string; 
  textoAlt: string; 
  titulo: string; 
  descripcion: string; 
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbCarouselModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  autosDestacados: AutoCarrousel[] = []; 

  ngOnInit() {
    this.autosDestacados = [
      {
        rutaImagen: 'assets/img/auto1.png', 
        textoAlt: 'Auto Deportivo',
        titulo: 'Deportivo Hornero',
        descripcion: 'Un auto potente y elegante para los amantes de la velocidad.'
      },
      {
        rutaImagen: 'assets/img/auto4.png', 
        textoAlt: 'Camioneta Familiar',
        titulo: 'SUV Familiar Horizon',
        descripcion: 'Ideal para viajes en familia, con espacio y comodidad.'
      },
      {
        rutaImagen: 'assets/img/auto3.png', 
        textoAlt: 'Sedán de Lujo',
        titulo: 'Sedán Executive',
        descripcion: 'El lujo y la tecnología se unen en este sofisticado sedán.'
      },
      {
        rutaImagen: 'assets/img/auto2.png', 
        textoAlt: 'Auto Compacto',
        titulo:'Compact CityDrive',
        descripcion: 'Perfecto para la ciudad, ágil y económico.'
      }
    ];
  }
}