// --- SECCIÓN DE IMPORTACIONES ---
// Aquí importamos todas las herramientas necesarias de Angular, una sola vez.

import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Importaciones para la comunicación con APIs (HttpClient) y para el idioma.
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

// Importación de las rutas de tu aplicación.
import { routes } from './app.routes';


// --- REGISTRO DEL IDIOMA (LOCALIZACIÓN) ---
// Esta línea "registra" los formatos de español de Argentina para que Angular
// sepa cómo mostrar precios, fechas y números correctamente.
registerLocaleData(localeEsAr, 'es-AR');


// --- CONFIGURACIÓN PRINCIPAL DE LA APLICACIÓN ---
export const appConfig: ApplicationConfig = {

  // 'providers' es la lista de todos los servicios y configuraciones
  // que estarán disponibles para toda tu aplicación.
  providers: [
    
    // Configuración estándar de Angular para la detección de cambios y el router.
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    
    // Habilita la hidratación del cliente para mejorar el rendimiento con SSR.
    provideClientHydration(withEventReplay()),
    
    // Habilita el servicio HttpClient usando el método 'fetch' moderno.
    // Esto soluciona el error 'No provider for HttpClient' y la advertencia de 'fetch'.
    provideHttpClient(withFetch()), 
    
    // Establece 'es-AR' como el idioma por defecto para toda la aplicación.
    // Esto soluciona el error del 'pipe number' que teníamos.
    { provide: LOCALE_ID, useValue: 'es-AR' } 
    
  ]
};
