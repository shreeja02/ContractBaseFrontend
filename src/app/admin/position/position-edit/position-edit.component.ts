import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositionService } from 'src/app/shared/services/position.service';

@Component({
  selector: 'app-position-edit',
  templateUrl: './position-edit.component.html',
  styleUrls: ['./position-edit.component.scss'],
})
export class PositionEditComponent implements OnInit {
  positionForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<PositionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positionService: PositionService) {
    if (this.data) {
      this.isEdit = true;
      this.positionForm = this.createForm(this.data);
    }
    else {
      this.positionForm = this.createForm({ positionName: '', isActive: false });
    }
  }

  ngOnInit() { }

  onBack() {
    this.positionForm.get('positionName')?.markAsUntouched();
    this.positionForm.get('positionName')?.clearValidators();
    this.positionForm.get('positionName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.positionForm.invalid) {
      return;
    }
    if (this.positionForm?.get('isActive')?.value == null || this.positionForm?.get('isActive')?.value == undefined) {
      this.positionForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.positionService.editPosition(this.positionForm.value, this.data?._id).subscribe(
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
      this.positionService.addNewPosition(this.positionForm.value).subscribe(
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
        positionName: new FormControl(formValues?.positionName || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }


}
