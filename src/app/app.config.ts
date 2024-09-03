import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { QuillModule } from 'ngx-quill';
import { QuillConfig } from './app.constants';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [ 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch()),
    provideClientHydration(),
    importProvidersFrom(QuillModule.forRoot(
      {
        modules: {
          toolbar: QuillConfig
        }
      }
    )),
  ]
};
