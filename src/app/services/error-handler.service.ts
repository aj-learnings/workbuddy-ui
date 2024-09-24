import { inject, Injectable } from '@angular/core';
import { AlertService } from './shared/alert.service';
import { ErrorResponse } from '../types/error-response';
import { UserService } from './shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  alertService = inject(AlertService);
  userService = inject(UserService);

  handleError(error: ErrorResponse) {
    switch (error.statusCode) {
      case 401:
        this.userService
            .publishUserDetails({
              loggedIn: false,
              username: '',
            });
        this.alertService
            .publishAlertValue({ 
              title: 'Oh no!', 
              message: 'Session Expired. Please login again!', 
              class: 'danger', 
              show: true,
            });
        break;
      case 500:
        this.alertService
            .publishAlertValue({ 
              title: 'Sorry!', 
              message: 'We are facing some issue!', 
              class: 'danger', 
              show: true,
            });
        break;
      default:
        this.alertService
            .publishAlertValue({ 
              title: 'Oops!', 
              message: error.message, 
              class: 'danger', 
              show: true,
            });
    }
  }
}
