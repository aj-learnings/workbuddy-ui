import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor  {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      try {
        token = localStorage.getItem('authToken');
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }

    const requiresAuth = request.url.includes('/api/workbuddy/verify') || request.method !== 'GET';
    if (requiresAuth && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
