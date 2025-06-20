import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { routes } from './app.routes';

// Registra el idioma para que Angular lo conozca
registerLocaleData(localeEsAr, 'es-AR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    
    // Proveedor para peticiones web con el modo 'fetch' recomendado
    provideHttpClient(withFetch()), 
    
    // Proveedor para establecer el idioma por defecto para los pipes de formato
    { provide: LOCALE_ID, useValue: 'es-AR' } 
  ]
};