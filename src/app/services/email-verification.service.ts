import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  constructor(private httpClient: HttpClient) { }

  generateOTP(): Observable<boolean> {
    return this.httpClient
               .get<boolean>(`${environment.apiBaseUrl}/email-verification`);
  }

  verifyOTP(otp: number): Observable<boolean> {
    return this.httpClient
               .post<boolean>(`${environment.apiBaseUrl}/email-verification`, { otp });
  }
}
