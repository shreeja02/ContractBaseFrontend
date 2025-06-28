import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isPasswordHidden=true;
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
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.formGroup = this.createFormGroup();
    this.getAllProvinces();
  }

  getAllProvinces(){
    this.provinceService.getAllProvinces().subscribe(
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
      email: [null, [Validators.required]],
      password: [null, [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      provinceId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      linkedInUrl: [null],
    })
  }

  signup() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.authService.signup(this.formGroup.value)
      .subscribe((data: any) => {
        if (data) {
          console.log('data: ', data);
          this.toastService.presentToast('Registration has been done Successfully!');
          //this.router.navigateByUrl('/contractor');
        }
      })
  }

}
