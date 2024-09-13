import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @Input() show: boolean = false;
  @Output() closeEmitter = new EventEmitter<boolean>();

  registerUser: boolean = false;

  newUser() {
    this.registerUser = true;
  }

  close() {
    this.registerUser = false;
    this.show = false;
    this.closeEmitter.emit(true);
  }
}
