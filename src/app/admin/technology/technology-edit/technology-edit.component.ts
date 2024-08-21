import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PositionService } from 'src/app/shared/services/position.service';
import { TechnologyService } from 'src/app/shared/services/technology.service';

@Component({
  selector: 'app-technology-edit',
  templateUrl: './technology-edit.component.html',
  styleUrls: ['./technology-edit.component.scss'],
})
export class TechnologyEditComponent implements OnInit {
  technologyForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allPositions: any[] = [];
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<TechnologyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private technologyService: TechnologyService,
    private positionService: PositionService) {
    if (this.data) {
      this.isEdit = true;
      this.technologyForm = this.createForm(this.data);
    }
    else {
      this.technologyForm = this.createForm();
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
    this.technologyForm.get('technologyName')?.markAsUntouched();
    this.technologyForm.get('technologyName')?.clearValidators();
    this.technologyForm.get('technologyName')?.updateValueAndValidity();
    this.dialogRef.close({ success: false });
  }

  onSave() {
    if (this.technologyForm.invalid) {
      return;
    }
    if (this.technologyForm?.get('isActive')?.value == null || this.technologyForm?.get('isActive')?.value == undefined) {
      this.technologyForm.get('isActive')?.setValue(false);
    }
    if (this.isEdit) {
      this.technologyService.editTechnology(this.technologyForm.value, this.data?._id).subscribe(
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
      this.technologyService.addNewTechnology(this.technologyForm.value).subscribe(
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
    return this.technologyForm.get('technologyName');
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        technologyName: new FormControl(formValues?.technologyName || '', Validators.required),
        positionId: new FormControl(formValues?.positionId?._id || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

}
