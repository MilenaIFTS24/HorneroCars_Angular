// --- IMPORTAMOS LAS HERRAMIENTAS NECESARIAS ---
// Importamos las herramientas básicas de Angular que necesita nuestro componente.
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// CommonModule nos da acceso a directivas como *ngIf y *ngFor en nuestro HTML.
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Importamos las herramientas para Formularios Reactivos de Angular
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos nuestro servicio de oficinas y la "forma" (interfaz) de los datos de una oficina.
import { OficinasService, Oficina } from '../../../../servicios/oficinas.service';


// ---  DEFINIMOS EL COMPONENTE ---
@Component({
  selector: 'app-contacto',        // El nombre de la etiqueta HTML para este componente: <app-contacto>
  standalone: true,               // Le decimos a Angular que este componente es moderno y gestiona sus propias dependencias.
  imports: [
    CommonModule,                  // Importamos CommonModule aquí para poder usar *ngIf y *ngFor en el HTML.
    ReactiveFormsModule // <-- Importamos esto para que el formulario funcione
  ],
  templateUrl: './contacto.component.html', // Enlace al archivo HTML del componente.
  styleUrls: ['./contacto.component.css']   // Enlace al archivo CSS del componente.
})
export class ContactoComponent implements OnInit, AfterViewInit, OnDestroy {

  // --- DEFINIMOS LAS PROPIEDADES DE LA CLASE ---

  // 'private map: any;' : Creamos una variable para guardar la referencia a nuestro mapa una vez creado.
  // Es 'privada' porque solo la usaremos dentro de este archivo .ts.
  private map: any;

  // 'public oficinaSeleccionada: Oficina | null = null;' : Esta es la variable clave para la interactividad.
  // Guardará el objeto completo de la oficina en la que el usuario haga clic.
  // Es 'pública' porque el archivo HTML necesita acceder a ella para mostrar los detalles.
  // Comienza como 'null' porque al principio no hay ninguna oficina seleccionada.
  public oficinaSeleccionada: Oficina | null = null;

  // 'public contactForm: FormGroup;' : Creamos la propiedad que guardará nuestro formulario reactivo.
  // Es 'public' porque nuestro archivo HTML necesita acceder a ella.
  public contactForm!: FormGroup;


  // --- EL CONSTRUCTOR ---
  // El constructor se ejecuta cuando se crea una instancia del componente.
  // Aquí "inyectamos" los servicios que nuestro componente necesita para trabajar.
  constructor(
    private oficinasService: OficinasService,  // Inyectamos nuestro servicio para poder pedirle los datos de las oficinas.
    @Inject(PLATFORM_ID) private platformId: Object, // Inyectamos PLATFORM_ID para saber si estamos en el servidor o en el navegador.
    private fb: FormBuilder // El FormBuilder es una herramienta para crear formularios
  ) {
    
  }

  // ngOnInit se ejecuta una vez, al inicio. Es el lugar perfecto para configurar el formulario.
  ngOnInit(): void {
    // Creamos la estructura y las reglas de validación de nuestro formulario
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // --- EL CICLO DE VIDA ngAfterViewInit ---
  // Este método especial de Angular se ejecuta automáticamente DESPUÉS de que el HTML del componente se ha renderizado.
  // Es el lugar perfecto para manipular elementos del DOM, como nuestro div del mapa.
  ngAfterViewInit(): void {
    // Verificamos si estamos corriendo en el navegador del cliente.
    if (isPlatformBrowser(this.platformId)) {
      // Si es así, importamos la librería 'leaflet' de forma dinámica.
      // Esto evita el error 'window is not defined' en el servidor.
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
    console.log("FUNCIÓN onSubmit EJECUTADA."); // <-- Log para depurar

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

    // Añadimos la capa de fondo del mapa (los "azulejos" de OpenStreetMap, que son gratuitos).
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    console.log("Mapa inicializado. Cargando marcadores de oficinas...");

    // Una vez que el mapa base está listo, llamamos a la función para poner los pines.
    this.cargarMarcadores(L);
  }

  /**
   * Obtiene los datos de las oficinas y crea un marcador interactivo para cada una.
   */
  private cargarMarcadores(L: any): void {
    // Usamos el servicio que inyectamos para pedir los datos del archivo oficinas.json.
    this.oficinasService.getOficinas().subscribe({
      // '.subscribe()' espera la respuesta del servicio.
      // Cuando los datos llegan con éxito, se ejecuta el código dentro de 'next'.
      next: (oficinas: Oficina[]) => {
        console.log("Oficinas recibidas del servicio:", oficinas);

        // Recorremos el array de oficinas que recibimos.
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
            // Angular detectará este cambio y actualizará el HTML automáticamente.
            this.oficinaSeleccionada = oficina;
          });

          // Finalmente, añadimos el marcador ya interactivo al mapa.
          marker.addTo(this.map);
        });

        console.log(`SCRIPT: ${oficinas.length} marcadores añadidos al mapa.`);
      },
      // Si hay un error al cargar el JSON, lo mostramos en la consola.
      error: (err) => console.error("Error al cargar los datos de las oficinas:", err)
    });
  }

  // Este método se ejecuta cuando el componente se destruye (ej. al navegar a otra página).
  // Es una buena práctica limpiar el mapa para liberar memoria.
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

