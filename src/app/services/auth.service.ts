import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginRequest } from '../types/user-login-request';
import { UserLoginResponse } from '../types/user-login-response';
import { environment } from '../../environments/environment';
import { UserRegisterRequest } from '../types/user-register-request';
import { UserRegisterResponse } from '../types/user-register-response';
import { VerifyUserResponse } from '../types/verify-user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  register(registerRequest: UserRegisterRequest): Observable<UserRegisterResponse> {
    return this.httpClient
               .post<UserRegisterResponse>(`${environment.apiBaseUrl}/signup`, registerRequest);
  }

  login(loginRequest: UserLoginRequest): Observable<UserLoginResponse> {
    return this.httpClient
               .post<UserLoginResponse>(`${environment.apiBaseUrl}/login`, loginRequest);
  }

  verify(): Observable<VerifyUserResponse> {
    return this.httpClient
               .get<VerifyUserResponse>(`${environment.apiBaseUrl}/verify`);
  }
}
