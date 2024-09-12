import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CityService } from 'src/app/shared/services/city.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  allRoles: any;
  allProvinces: any;
  allCities: any;
  userForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  constructor(private cityService: CityService,
    private provinceService: ProvinceService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data) {
      this.isEdit = true;
      this.getAllCitiesByProvince(this.data.provinceId);
      this.userForm = this.createForm(this.data);
    }
    else {
      this.userForm = this.createForm();
    }
  }

  ngOnInit() {
    this.getAllProvinces();
    this.getAllRoles();
  }

  getAllCitiesByProvince(id: any) {
    this.cityService.getCitiesByProvince(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCities = res.result;
        }
      }
    );
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

  getAllRoles() {
    this.roleService.getAllActiveRoles().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allRoles = res.result;
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

  createForm(formValues?: any) {
    return this.fb.group(
      {
        firstName: new FormControl(formValues?.firstName || '', Validators.required),
        lastName: new FormControl(formValues?.lastName || '', Validators.required),
        email: new FormControl(formValues?.email || '', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
        phone: new FormControl(formValues?.phone || '', [Validators.required, Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern('[0-9]*')]),
        provinceId: new FormControl(formValues?.provinceId || '', Validators.required),
        cityId: new FormControl(formValues?.cityId || '', Validators.required),
        roleId: new FormControl(formValues?.roleId || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

  onSave() {
    if (this.userForm.invalid) {
      return;
    }
    if (this.userForm?.get('isActive')?.value == null || this.userForm?.get('isActive')?.value == undefined) {
      this.userForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.userService.editUser(this.userForm.value, this.data?._id).subscribe(
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
      this.userService.addNewUser({ ...this.userForm.value, isDefaultPassword: true }).subscribe(
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

  onBack() {
    // this.roleForm.get('roleName')?.markAsUntouched();
    // this.roleForm.get('roleName')?.clearValidators();
    // this.roleForm.get('roleName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

}
