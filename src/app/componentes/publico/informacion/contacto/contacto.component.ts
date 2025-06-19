import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

// NO importamos LeafletModule. Solo importaremos La libreria (L) dinámicamente.

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule // Solo necesitamos CommonModule para ngIf/ngFor si los usamos
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements AfterViewInit, OnDestroy {

  private map: any;

  // Inyectamos PLATFORM_ID para saber si estamos en el servidor o navegador.
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // ngAfterViewInit se ejecuta después de que el HTML del componente (incluyendo el div#mapa-contacto) está listo.
  ngAfterViewInit(): void {
    // Solo ejecutamos este código si estamos en un navegador.
    if (isPlatformBrowser(this.platformId)) {
      // Usamos import() dinámico para asegurarnos de que Leaflet NUNCA se cargue en el servidor.
      import('leaflet').then(L => {
        console.log("Librería Leaflet cargada dinámicamente en el navegador.");
        this.inicializarMapa(L);
      }).catch(err => {
        console.error("Error al cargar la librería Leaflet dinámicamente", err);
      });
    }
  }

  /**
   * Esta función contiene toda la lógica de Leaflet.
   * Recibe la librería 'L' como parámetro una vez que se ha cargado.
   */
  private inicializarMapa(L: any): void {
    // Evitar inicializar el mapa dos veces si algo extraño ocurre
    if (this.map) {
      this.map.remove();
    }

    // Crear la instancia del mapa en nuestro div con id 'mapa-contacto'
    this.map = L.map('mapa-contacto').setView([-40.0, -64.0], 4); // Centrado en Argentina

    // Añadir la capa de teselas (el mapa de fondo de OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    console.log("Mapa de Leaflet inicializado correctamente.");

    // Aquí es donde añadiremos los marcadores de las oficinas en nuestro siguiente paso.
  }

  // ngOnDestroy se ejecuta cuando el componente se destruye. Es una buena práctica
  // limpiar el mapa para liberar memoria.
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}