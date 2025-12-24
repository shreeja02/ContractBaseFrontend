import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  emailSent = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const email = this.forgotPasswordForm.get('email')?.value;

    this.http.post(`${environment.apiEndPoint}Users/forgot-password`, { email })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.emailSent = true;
          this.successMessage = `Reset link has been sent to ${email}. Please check your email.`;
          this.showSuccessAlert();
        },
        error: (error: any) => {
          console.log('error: ', error);
          this.loading = false;
          this.errorMessage = error?.error?.errors || 'Email not found. Please check and try again.';
        }
      });
  }

  private async showSuccessAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Reset link has been sent to your email. Please check your inbox and click the reset link.',
      buttons: [
        {
          text: 'Back to Login',
          handler: () => {
            this.router.navigate(['/auth/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  goBackToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
