import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// 1. IMPORTA el proveedor de HttpClient desde @angular/common/http
import { provideHttpClient } from '@angular/common/http';

// ▼▼▼ PASO 1: AÑADE ESTOS DOS IMPORTS PARA EL IDIOMA ▼▼▼
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';

import { routes } from './app.routes';

// Registramos el idioma para que Angular lo conozca
registerLocaleData(localeEsAr, 'es-AR'); // Registra los datos de formato para 'es-AR'


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // 2. AÑADE el proveedor aquí al final de la lista
    provideHttpClient(),

    // ▼▼▼ PASO 3: AÑADE ESTE PROVEEDOR PARA ESTABLECER EL IDIOMA POR DEFECTO ▼▼▼
    { provide: LOCALE_ID, useValue: 'es-AR' }

  ]
};

