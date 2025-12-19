import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { CityService } from 'src/app/shared/services/city.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { LoadingController } from '@ionic/angular';

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
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private userService: UserService,
    private contractorService: ContractorService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getAllProvinces();
    this.getAllCities();
    
    // Subscribe to current contractor data if coming from view profile
    this.contractorService.currentContractor$.subscribe((contractorData: any) => {
      if (contractorData && contractorData.userId) {
        // If we have contractor data, use it to populate the form
        this.currentUser = contractorData.userId;
        this.form = this.createFormGroup(contractorData.userId);
      }
    });
    
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        console.log('this.currentUser: ', this.currentUser);
        this.form = this.createFormGroup(data);
      }
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

  public get firstName() {
    return this.form.get('firstName');
  }

  public get lastName() {
    return this.form.get('lastName');
  }

  public get email() {
    return this.form.get('email');
  }

  public get phone() {
    return this.form.get('phone');
  }

  public get cityId() {
    return this.form.get('cityId');
  }

  createFormGroup(dataItem: any = {}) {

    return this.fb.group({
      firstName: [dataItem.firstName, Validators.required],
      lastName: [dataItem.lastName, Validators.required],
      email: [dataItem.email, [Validators.required, Validators.email]],
      phone: [dataItem.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      provinceId: [dataItem.province?._id, Validators.required],
      cityId: [dataItem.city?._id, Validators.required],
    });
  }

  async next() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Saving personal information...',
      spinner: 'circular'
    });
    await loading.present();
    
    this.userService.editUser({ ...this.currentUser, ... this.form.value }, this.currentUser.id)
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          loading.dismiss();
          if (data.success) {
            this.authService.initUser({ ...this.currentUser, ... this.form.value });
            this.router.navigateByUrl('contractor/profile/business');
          }
        },
        (error) => {
          this.isLoading = false;
          loading.dismiss();
        }
      );
  }

}
