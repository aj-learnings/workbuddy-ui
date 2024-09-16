import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDetails } from '../../types/user-details';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new Subject<UserDetails>();

  user$ = this.userSubject.asObservable();

  publishUserDetails(userDetails: UserDetails) {
    this.userSubject.next(userDetails);
  }
}
