import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { CityService } from 'src/app/shared/services/city.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { PositionService } from 'src/app/shared/services/position.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  styleUrls: ['./contractor-edit.component.scss'],
})
export class ContractorEditComponent implements OnInit {
  myControl = new FormControl<string | any>('', Validators.required);
  contractorForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allContractors: any[] = [];
  filteredContractors!: Observable<any[]>;
  selectedUser = '';
  selectedUserData: any;
  allPositions: any;
  allProvinces: any;
  allCities: any;
  allLocations: any = [
    { location: 'Remote', days: 0 },
    { location: 'Hybrid', days: 0 },
    { location: 'Inperson', days: 5 },
  ]
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContractorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractorService: ContractorService,
    private userService: UserService,
    private positionService: PositionService,
    private provinceService: ProvinceService,
    private cityService: CityService) {
    if (this.data) {
      this.isEdit = true;
      this.contractorForm = this.createForm(this.data);
    }
    else {
      this.contractorForm = this.createForm();
    }
  }

  ngOnInit() {
    this.filteredContractors = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.firstName + ' ' + value?.lastName;
        return name ? this._filter(name as string) : this.allContractors.slice();
      }),
    );
    this.getAllContractorsFromUser();
    this.getAllPositions();
    this.getAllProvinces();
  }

  getAllProvinces() {
    this.provinceService.getAllActiveProvinces().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allProvinces = res.result;
        }
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

  getAllPositions() {
    this.positionService.getAllActivePositions().subscribe((res: any) => {
      if (res.result.length) {
        this.allPositions = res.result;
      }
    },
      (err) => {
        console.log(err);
      });
  }

  getAllContractorsFromUser() {
    this.userService.getAllActiveContractorFromUser().subscribe((res: any) => {
      if (res.result.length) {
        this.allContractors = res.result;
      }
    },
      (err) => {
        console.log(err);
      });
  }

  onBack() {
    this.contractorForm.get('cityName')?.markAsUntouched();
    this.contractorForm.get('cityName')?.clearValidators();
    this.contractorForm.get('cityName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.contractorForm.invalid) {
      return;
    }
    if (this.contractorForm?.get('isActive')?.value == null || this.contractorForm?.get('isActive')?.value == undefined) {
      this.contractorForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.contractorService.editContractor(this.contractorForm.value, this.data?._id).subscribe(
        (res: any) => {
          if (res.result) {
            this.dialogRef.close({ success: true });
          }
        },
        (err) => {
          this.errorMessage = err.errors;
        }
      );
    }
    else {
      this.contractorService.addNewContractor(this.contractorForm.value).subscribe(
        (res: any) => {
          if (res.result) {
            this.dialogRef.close({ success: true });
          }
        },
        (err) => {
          this.errorMessage = err.errors;
        }
      );
    }
    this.dialogRef.close({ success: true });
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        userId: new FormControl(formValues?.userId || '', Validators.required),
        businessNumber: new FormControl(formValues?.businessNumber || '', Validators.required),
        businessAddressLine1: new FormControl(formValues?.businessAddressLine1 || '', Validators.required),
        businessProvinceId: new FormControl(formValues?.businessProvinceId || '', Validators.required),
        businessCityId: new FormControl(formValues?.businessCityId || '', Validators.required),
        businessZipCode: new FormControl(formValues?.businessZipCode || '', [Validators.required, Validators.pattern('^([0-9]{5}|[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9])$')]),
        position: new FormControl(formValues?.position || '', Validators.required),
        location: new FormControl(formValues?.location || [], Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

  displayFn(user: any): string {
    this.contractorForm.get('userId')?.setValue(user._id);
    return user && user.firstName ? user.firstName + ' ' + user.lastName : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allContractors.filter(option => option.firstName.toLowerCase().includes(filterValue));
  }

}
