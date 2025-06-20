import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Importamos el servicio y la interfaz
import { OficinasService, Oficina } from '../../../../servicios/oficinas.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements AfterViewInit, OnDestroy {

  private map: any;

  constructor(
    private oficinasService: OficinasService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    // Solo ejecutamos este código si estamos en un navegador
    if (isPlatformBrowser(this.platformId)) {
      // Importamos Leaflet dinámicamente para que no se ejecute en el servidor
      import('leaflet').then(L => {
        console.log("Librería Leaflet cargada correctamente.");
        this.inicializarMapa(L);
      }).catch(err => {
        console.error("Error al cargar la librería Leaflet:", err);
      });
    }
  }

  private inicializarMapa(L: any): void {
    if (this.map) { this.map.remove(); }

    // Creamos el mapa en el div 'mapa-contacto'
    this.map = L.map('mapa-contacto').setView([-40.0, -64.0], 4);

    // Añadimos el mapa de fondo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    console.log("Mapa inicializado. Cargando marcadores...");

    // Llamamos a la función para poner los pines
    this.cargarMarcadores(L);
  }

  private cargarMarcadores(L: any): void {
    this.oficinasService.getOficinas().subscribe({
      next: (oficinas) => {
        console.log("Oficinas recibidas:", oficinas);

        oficinas.forEach(oficina => {
          const popupContent = `
            <strong>${oficina.nombre}</strong><br>
            ${oficina.direccion}<br>
            Tel: ${oficina.telefono}
          `;

          L.marker([oficina.coordenadas.lat, oficina.coordenadas.lng])
            .addTo(this.map)
            .bindPopup(popupContent);
        });

        console.log(`${oficinas.length} marcadores añadidos al mapa.`);
      },
      error: (err) => console.error("Error al cargar los datos de las oficinas:", err)
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}