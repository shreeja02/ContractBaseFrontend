import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProvinceService } from 'src/app/shared/services/province.service';

@Component({
  selector: 'app-province-edit',
  templateUrl: './province-edit.component.html',
  styleUrls: ['./province-edit.component.scss'],
})
export class ProvinceEditComponent implements OnInit {
  provinceForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProvinceEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provinceService: ProvinceService) {
    if (this.data) {
      this.isEdit = true;
      this.provinceForm = this.createForm(this.data);
    }
    else {
      this.provinceForm = this.createForm({ provinceForm: '', isActive: false });
    }
  }

  ngOnInit() { }

  onBack() {
    this.provinceForm.get('provinceName')?.markAsUntouched();
    this.provinceForm.get('provinceName')?.clearValidators();
    this.provinceForm.get('provinceName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.provinceForm.invalid) {
      return;
    }
    if (this.provinceForm?.get('isActive')?.value == null || this.provinceForm?.get('isActive')?.value == undefined) {
      this.provinceForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.provinceService.editProvince(this.provinceForm.value, this.data?._id).subscribe(
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
      this.provinceService.addNewProvince(this.provinceForm.value).subscribe(
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
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        provinceName: new FormControl(formValues?.provinceName || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
