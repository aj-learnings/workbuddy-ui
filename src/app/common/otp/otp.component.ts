import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgOtpInputComponent, NgOtpInputConfig, NgOtpInputModule } from  'ng-otp-input';
import { EmailVerificationService } from '../../services/email-verification.service';
import { AlertService } from '../../services/shared/alert.service';
import { UserService } from '../../services/shared/user.service';
import { UserDetails } from '../../types/user-details';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    CommonModule,
    NgOtpInputModule,
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnInit, AfterViewInit {

  emailVerificationService = inject(EmailVerificationService);
  userService = inject(UserService);
  alertService = inject(AlertService);
  
  @Input() userDetails?: UserDetails;
  @Output() closeEmitter = new EventEmitter<boolean>();
  
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput?: NgOtpInputComponent;
  
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  }
  message: string = 'Sending OTP...';
  messageClass: string = 'info';
  attempts: number = 3;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ngOtpInput?.otpForm?.disable();
    this.sendEmail();
  }

  onOtpChange(otp: string) {
    if (otp.length !== this.config.length) {
      return;
    }
    this.verifyOTP(parseInt(otp));
  }

  sendEmail() {
    this.emailVerificationService
        .generateOTP()
        .subscribe({
          next: (resposne: boolean) => {
            this.message = resposne ? 'OTP has been sent to you' : 'Something went wrong. Please try again later';
            this.messageClass = resposne ? 'success' : 'danger';
            if (resposne) {
              this.ngOtpInput?.otpForm?.enable();
            }
          },
          error: (error: any) => {
            this.message = 'Something went wrong. Please try again later';
            this.messageClass = 'danger';
          }
        });
  }

  verifyOTP(otp: number) {
    this.ngOtpInput?.otpForm?.disable();
    this.emailVerificationService
        .verifyOTP(otp)
        .subscribe({
          next: (resposne: boolean) => {
            this.ngOtpInput?.otpForm?.enable();
            if (resposne) {
              this.message = 'Email has been verified';
              this.messageClass = 'success';
              this.alertService
                  .publishAlertValue({ 
                    title: 'Yayy!', 
                    message: `Email has been verified`, 
                    class: 'success', 
                    show: true 
                  });
              this.userService
                  .publishUserDetails({ 
                    loggedIn: true, 
                    username: this.userDetails?.username,
                    isVerified: true
                  });
              this.close();
            } else {
              this.attempts -= 1;
              if (!this.attempts) {
                this.close();
              }
              this.message = `Incorrect OTP. You have ${this.attempts} left`;
              this.messageClass = 'danger';
            }
          },
          error: (error: any) => {
            this.message = 'Something went wrong. Please try again later';
            this.messageClass = 'danger';
          }
        });
  }

  close() {
    this.closeEmitter.emit(true);
  }
}
