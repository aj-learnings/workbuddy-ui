import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRegisterRequest } from '../types/user-register-request';
import { AuthService } from '../services/auth.service';
import { UserRegisterResponse } from '../types/user-register-response';
import { AlertService } from '../services/shared/alert.service';
import { UserLoginRequest } from '../types/user-login-request';
import { UserLoginResponse } from '../types/user-login-response';
import { UserService } from '../services/shared/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authService = inject(AuthService);
  alertService = inject(AlertService);
  userService = inject(UserService);

  @Input() show: boolean = false;
  @Output() closeEmitter = new EventEmitter<boolean>();
  inputForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.inputForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  registerUser: boolean = false;

  newUser() {
    this.inputForm.reset();
    this.registerUser = true;
  }

  register() {
    const userRegisterRequest: UserRegisterRequest = {
      username: this.inputForm.get('username')?.value ?? '',
      email: this.inputForm.get('email')?.value ?? '',
      password: this.inputForm.get('password')?.value ?? '',
    };
    this.authService
        .register(userRegisterRequest)
        .subscribe({
          next: (response: UserRegisterResponse) => {
            this.close();
            this.alertService
                .publishAlertValue({ 
                  title: 'Awesome!', 
                  message: `User ${response.username} has been registered`, 
                  class: 'success', 
                  show: true 
                });
          },
          error: (error) => {
            this.errorMessage = error.error.message;
          }
        });
  }

  login() {
    const userLoginRequest: UserLoginRequest = {
      usernameOrEmail: this.inputForm.get('username')?.value ?? '',
      password: this.inputForm.get('password')?.value ?? '',
    };
    this.authService
        .login(userLoginRequest)
        .subscribe({
          next: (response: UserLoginResponse) => {
            localStorage.setItem('token', response.token);
            this.userService
                .publishUserDetails({ 
                  loggedIn: true, 
                  username: response.username,
                  isVerified: response.isVerified });
            this.close();
            this.alertService
                .publishAlertValue({ 
                  title: 'Awesome!', 
                  message: `Login Successful`, 
                  class: 'success', 
                  show: true 
                });
          },
          error: (error) => {
            this.errorMessage = error.error.message;
          }
        });
  }

  close() {
    this.inputForm.reset();
    this.errorMessage = '';
    this.registerUser = false;
    this.show = false;
    this.closeEmitter.emit(true);
  }
}
