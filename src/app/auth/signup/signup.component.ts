import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isPasswordHidden=true;
  loading = false;
  public formGroup!: FormGroup;
  public allProvinces : any[]=[];
  public confirmPassword = new FormControl('');
  passwordsDiffer=false;
  allCities: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private toastService: ToastService,
    private roleService: RoleService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.formGroup = this.createFormGroup();
    this.getAllProvinces();
  }

  getAllProvinces(){
    this.provinceService.getAllActiveProvinces().subscribe(
      (res:any)=>{
        this.allProvinces = res;
      }
    );
  }

  handleChangeForProvince(event: any) {
    this.cityService.getCitiesByProvince(event.detail.value).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCities = res.result;
        }
      }
    );
  }

  createFormGroup() {
    return this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
    }, { validator: this.passwordMatchValidator } )
  }

   passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  signup() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.signup(this.formGroup.value)
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            if(data.result && !data.result.errors) {
              this.showSuccessAlert();
            } else {
              const errorMessages = data.result?.errors?.map((err: any) => err.msg).join(' ') || 'Registration failed. Please try again.';
              this.showErrorAlert(errorMessages);
            }
          }
        },
        (error: any) => {
          this.loading = false;
          const errorMessage = error?.error?.message || 'An error occurred during registration. Please try again.';
          this.showErrorAlert(errorMessage);
        }
      );
  }

  private async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: 'Account Created',
      message: 'Your account has been created successfully. You can now login with your credentials.',
      buttons: [
        {
          text: 'Login',
          handler: () => {
            // Clear any existing auth data first
            localStorage.removeItem('authToken');
            this.authService.initUser(null);
            
            // Use setTimeout to ensure state is cleared before navigation
            setTimeout(() => {
              this.router.navigate(['/auth/login']).catch(err => {
                console.error('Navigation error:', err);
                // Fallback navigation method
                window.location.href = '/auth/login';
              });
            }, 100);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registration Failed',
      subHeader: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
