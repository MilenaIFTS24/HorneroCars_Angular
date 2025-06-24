import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OficinasService, Oficina } from '../../../../servicios/oficinas.service';
@Component({
  selector: 'app-contacto',
  standalone: true,               // Le decimos a Angular que este componente es moderno y gestiona sus propias dependencias.
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit, AfterViewInit, OnDestroy {

  // --- DEFINIMOS LAS PROPIEDADES DE LA CLASE ---

  // 'private map: any;' : Creamos una variable para guardar la referencia a nuestro mapa una vez creado.

  private map: any;
  public oficinaSeleccionada: Oficina | null = null;

  public contactForm!: FormGroup;

  constructor(
    private oficinasService: OficinasService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngAfterViewInit(): void {
    // Verificamos si estamos corriendo en el navegador del cliente.
    if (isPlatformBrowser(this.platformId)) {
      // Si es así, importamos la librería 'leaflet' de forma dinámica.
      import('leaflet').then(L => {
        console.log("Librería Leaflet cargada correctamente.");
        // Una vez que Leaflet está cargado, llamamos a la función para crear el mapa.
        this.inicializarMapa(L);
      }).catch(err => {
        console.error("Error al cargar la librería Leaflet:", err);
      });
    }
  }

  // Función para manejar el envío del formulario
  onSubmit(): void {
    console.log("FUNCIÓN onSubmit EJECUTADA.");

    // Marcar todos los campos como "tocados" para mostrar errores de validación si los hubiera
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      console.log("Formulario inválido. Por favor, revisa los campos.");
      alert('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    console.log("Formulario de Contacto Enviado:", this.contactForm.value);
    alert(`¡Gracias, ${this.contactForm.value.nombre}!\nHemos recibido tu mensaje y te contactaremos a la brevedad.`);

    this.contactForm.reset(); // Limpiamos el formulario
  }


  // --- FUNCIONES PERSONALIZADAS ---

  /**
   * Esta función crea el mapa base en la pantalla.
   * Recibe la librería 'L' de Leaflet como parámetro para poder usar sus funciones.
   */
  private inicializarMapa(L: any): void {
    // Si por alguna razón el mapa ya existiera, lo eliminamos para evitar duplicados.
    if (this.map) {
      this.map.remove();
    }

    // Creamos la instancia del mapa en nuestro div con id 'mapa-contacto'.
    this.map = L.map('mapa-contacto').setView([-40.0, -64.0], 4); // Centrado en Argentina.

    // Añadimos la capa de fondo del mapa (los "azulejos" de OpenStreetMap).
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    console.log("Mapa inicializado. Cargando marcadores de oficinas...");

    // Una vez que el mapa base está listo, llamamos a la función para poner los pines.
    this.cargarMarcadores(L);
  }

  private cargarMarcadores(L: any): void {
    // Usamos el servicio que inyectamos para pedir los datos del archivo oficinas.json.
    this.oficinasService.getOficinas().subscribe({
      next: (oficinas: Oficina[]) => {
        console.log("Oficinas recibidas del servicio:", oficinas);
        oficinas.forEach(oficina => {
          // Para cada oficina, creamos el contenido HTML para su ventana emergente (popup).
          const popupContent = `
            <div style="font-family: 'Lato', sans-serif; font-size: 14px;">
              <strong style="color: var(--hornero-naranja, #E8751A); font-size: 16px;">${oficina.nombre}</strong><br>
              ${oficina.direccion}
            </div>
          `;

          // Creamos el marcador en las coordenadas de la oficina.
          const marker = L.marker([oficina.coordenadas.lat, oficina.coordenadas.lng]);

          // Asociamos el popup al marcador.
          marker.bindPopup(popupContent);

          // Añadimos un listener para el evento 'click' a cada marcador.
          marker.on('click', () => {
            console.log("Clic en el marcador de:", oficina.ciudad);

            // Cuando se hace clic, actualizamos nuestra variable 'oficinaSeleccionada'
            // con los datos de la oficina correspondiente a este marcador.
            this.oficinaSeleccionada = oficina;
          });

          // Finalmente, añadimos el marcador ya interactivo al mapa.
          marker.addTo(this.map);
        });

        console.log(`SCRIPT: ${oficinas.length} marcadores añadidos al mapa.`);
      },
      error: (err) => console.error("Error al cargar los datos de las oficinas:", err)
    });
  }

  // Este método se ejecuta cuando el componente se destruye 
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

}

