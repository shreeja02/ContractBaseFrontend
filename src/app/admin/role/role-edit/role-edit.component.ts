import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TechnologyEditComponent } from '../../technology/technology-edit/technology-edit.component';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit {
  roleForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<TechnologyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService) {
    if (this.data) {
      this.isEdit = true;
      this.roleForm = this.createForm(this.data);
    }
    else {
      this.roleForm = this.createForm();
    }
  }

  ngOnInit() { }

  onBack() {
    this.roleForm.get('roleName')?.markAsUntouched();
    this.roleForm.get('roleName')?.clearValidators();
    this.roleForm.get('roleName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.roleForm.invalid) {
      return;
    }
    if (this.roleForm?.get('isActive')?.value == null || this.roleForm?.get('isActive')?.value == undefined) {
      this.roleForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.roleService.editRole(this.roleForm.value, this.data?._id).subscribe(
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
      this.roleService.addNewRole(this.roleForm.value).subscribe(
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
        roleName: new FormControl(formValues?.roleName || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
