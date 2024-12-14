import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { CityService } from 'src/app/shared/services/city.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {

  public form: FormGroup = this.createFormGroup();
  allProvinces: any[] = [];
  allCities: any[] = [];
  currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getAllProvinces();
    this.getAllCities();
    this.authService.currentUser$.subscribe((data) => {
      this.currentUser = data;
      this.form = this.createFormGroup(data);
    })
  }

  getAllProvinces() {
    this.provinceService.getAllProvinces().subscribe((data: any) => {
      if (data) {
        this.allProvinces = data;
      }
    })
  }

  getAllCities() {
    this.cityService.getAllCities().subscribe((data: any) => {
      if (data) {
        this.allCities = data;
      }
    })
  }

  getFilteredCities() {
    if (this.provinceId?.value) {
      return this.allCities.filter(x => x.provinceId?._id == this.provinceId?.value);
    }
    return [];
  }

  public get provinceId() {
    return this.form.get('provinceId');
  }

  createFormGroup(dataItem: any = {}) {

    return this.fb.group({
      firstName: [dataItem.firstName, Validators.required],
      lastName: [dataItem.lastName, Validators.required],
      email: [dataItem.email, [Validators.required, Validators.email]],
      phone: [dataItem.phone, Validators.required],
      provinceId: [dataItem.province?._id, Validators.required],
      cityId: [dataItem.city?._id, Validators.required],
    });
  }

  next() {
    if (!this.form.valid) {
      return;
    }
    this.userService.editUser({ ...this.currentUser, ... this.form.value }, this.currentUser.id)
      .subscribe((data: any) => {
        if (data.success) {
          this.authService.initUser({ ...this.currentUser, ... this.form.value });
          this.router.navigateByUrl('contractor/profile/business');
        }
      });
  }

}
