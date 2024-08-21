import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CityService } from 'src/app/shared/services/city.service';
import { ProvinceService } from 'src/app/shared/services/province.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent implements OnInit {

  cityForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allProvinces: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CityEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cityService: CityService,
    private provinceService: ProvinceService) {
    if (this.data) {
      this.isEdit = true;
      this.cityForm = this.createForm(this.data);
    }
    else {
      this.cityForm = this.createForm();
    }
  }

  ngOnInit() {
    this.getAllProvinces();
  }

  getAllProvinces() {
    this.provinceService.getAllActiveProvinces().subscribe((res: any) => {
      if (res.result.length) {
        this.allProvinces = res.result;
      }
    },
      (err) => {
        console.log(err);
      });
  }

  onBack() {
    this.cityForm.get('cityName')?.markAsUntouched();
    this.cityForm.get('cityName')?.clearValidators();
    this.cityForm.get('cityName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.cityForm.invalid) {
      return;
    }
    if (this.cityForm?.get('isActive')?.value == null || this.cityForm?.get('isActive')?.value == undefined) {
      this.cityForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.cityService.editCity(this.cityForm.value, this.data?._id).subscribe(
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
      this.cityService.addNewCity(this.cityForm.value).subscribe(
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
        cityName: new FormControl(formValues?.cityName || '', Validators.required),
        provinceId: new FormControl(formValues?.provinceId?._id || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
