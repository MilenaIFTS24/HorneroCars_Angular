import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http'; // ✅ para HttpClient
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ para animaciones Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // ✅ para NgbModal

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // ✅ Agregados necesarios:
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(NgbModule)
  ]
};