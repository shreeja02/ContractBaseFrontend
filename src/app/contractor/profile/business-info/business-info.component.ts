import { Component, OnInit } from '@angular/core';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { LocationInfoComponent } from '../location-info/location-info.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss'],
})
export class BusinessInfoComponent implements OnInit {

  public form: FormGroup = this.createFormGroup();
  allProvinces: any[] = [];
  allCities: any[] = [];
  currentContractor: any;

  constructor(
    private router: Router,
    private contractorService: ContractorService,
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private cityService: CityService
  ) { }

  ngOnInit() {
    this.getAllProvinces();
    this.getAllCities();
    this.contractorService.currentContractor$.subscribe((currentContractor) => {
      this.currentContractor = currentContractor;
      this.form = this.createFormGroup(currentContractor);
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
    return this.form.get('businessProvinceId');
  }

  createFormGroup(dataItem: any = {}) {
    dataItem = dataItem || {};

    return this.fb.group({
      businessNumber: [dataItem.businessNumber, Validators.required],
      businessAddressLine1: [dataItem.businessAddressLine1, Validators.required],
      businessAddressLine2: [dataItem.businessAddressLine2],
      businessProvinceId: [dataItem.businessProvinceId, Validators.required],
      businessCityId: [dataItem.businessCityId, Validators.required],
      businessZipCode: [dataItem.businessZipCode, Validators.required],
      linkedInProfile: [dataItem.linkedInProfile, Validators.required],
    });
  }


  previous() {
    this.router.navigateByUrl('contractor/profile/basic');
  }

  next() {
    if (!this.form.valid) return;
    this.contractorService.editContractor({ ...this.currentContractor, ...this.form.value }, this.currentContractor._id)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigateByUrl('contractor/profile/industry');
        }
      });
  }

}
