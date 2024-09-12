import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertDetails } from '../../types/alert-details';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<AlertDetails>();

  alert$ = this.alertSubject.asObservable();

  publishAlertValue(alertDetails: AlertDetails) {
    this.alertSubject.next(alertDetails);
  }
}
