import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { PositionService } from 'src/app/shared/services/position.service';

@Component({
  selector: 'app-industry-edit',
  templateUrl: './industry-edit.component.html',
  styleUrls: ['./industry-edit.component.scss'],
})
export class IndustryEditComponent implements OnInit {
  industryForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allPositions: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<IndustryEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private industryService: IndustryService,
    private positionService: PositionService) {
    if (this.data) {
      this.isEdit = true;
      this.industryForm = this.createForm(this.data);
    }
    else {
      this.industryForm = this.createForm();
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
      (err) => {
        console.log(err);
      });
  }

  onBack() {
    this.industryForm.get('positionName')?.markAsUntouched();
    this.industryForm.get('positionName')?.clearValidators();
    this.industryForm.get('positionName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.industryForm.invalid) {
      return;
    }
    if (this.industryForm?.get('isActive')?.value == null || this.industryForm?.get('isActive')?.value == undefined) {
      this.industryForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.industryService.editIndustry(this.industryForm.value, this.data?._id).subscribe(
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
      this.industryService.addNewIndustry(this.industryForm.value).subscribe(
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
    return this.industryForm.get('industryName');
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        industryName: new FormControl(formValues?.industryName || '', Validators.required),
        positionId: new FormControl(formValues?.positionId?._id || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
