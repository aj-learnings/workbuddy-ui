import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationDetails } from '../../types/confirmation-details';
import { CommonModule } from '@angular/common';
import { ConfirmResponse } from '../../types/confirm-response';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  constructor() {}

  @Input() show: boolean = false;
  @Input() confirmationDetails: ConfirmationDetails = {
    id: '',
    message: '',
    heading: '',
    warningMessage: '',
    successAction: '',
    successClass: '',
  };
  @Output() closeEmitter = new EventEmitter<ConfirmResponse>();

  confirm() {
    this.show = false;
    this.closeEmitter.emit({ confirm: true, id: this.confirmationDetails.id });
  }

  close() {
    this.show = false;
    this.closeEmitter.emit({ confirm: false });
  }
}
