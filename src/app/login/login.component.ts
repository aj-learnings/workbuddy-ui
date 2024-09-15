import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  @Input() show: boolean = false;
  @Output() closeEmitter = new EventEmitter<boolean>();
  inputForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.inputForm = this.formBuilder.group({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

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
