import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  isPasswordHidden = true;
  isConfirmPasswordHidden = true;
  errorMessage = '';
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    // Get token from URL
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Invalid reset link. Please request a new one.';
      }
    });
    this.initializeForm();
  }

  initializeForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordPatternValidator()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordPatternValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumeric = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? { pattern: true } : null;
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const newPassword = this.resetPasswordForm.get('password')?.value;

    this.http.post(`${environment.apiEndPoint}Users/forgot-password`, {
      token: this.token,
      newPassword: newPassword
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.showSuccessAlert();
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  private async showSuccessAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your password has been reset successfully. You can now login with your new password.',
      buttons: [
        {
          text: 'Go to Login',
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
