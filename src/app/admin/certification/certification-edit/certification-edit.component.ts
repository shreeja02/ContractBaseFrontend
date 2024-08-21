import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { PositionService } from 'src/app/shared/services/position.service';

@Component({
  selector: 'app-certification-edit',
  templateUrl: './certification-edit.component.html',
  styleUrls: ['./certification-edit.component.scss'],
})
export class CertificationEditComponent implements OnInit {

  certificationForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allPositions: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CertificationEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private certificationService: CertificationService,
    private positionService: PositionService) {
    if (this.data) {
      this.isEdit = true;
      this.certificationForm = this.createForm(this.data);
    }
    else {
      this.certificationForm = this.createForm();
    }
  }

  ngOnInit() {
    this.getAllPositions();
  }

  getAllPositions() {
    this.positionService.getAllActivePositions().subscribe((res: any) => {
      if (res.result.length) {
        this.allPositions = res.result;
      }
    },
      (err: any) => {
        console.log(err);
      });
  }

  onBack() {
    this.certificationForm.get('certificationName')?.markAsUntouched();
    this.certificationForm.get('certificationName')?.clearValidators();
    this.certificationForm.get('certificationName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.certificationForm.invalid) {
      return;
    }
    if (this.certificationForm?.get('isActive')?.value == null || this.certificationForm?.get('isActive')?.value == undefined) {
      this.certificationForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.certificationService.editCertification(this.certificationForm.value, this.data?._id).subscribe(
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
      this.certificationService.addNewCertification(this.certificationForm.value).subscribe(
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

  get controls() {
    return this.certificationForm.get('certificationName');
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        certificationName: new FormControl(formValues?.certificationName || '', Validators.required),
        positionId: new FormControl(formValues?.positionId?._id || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
