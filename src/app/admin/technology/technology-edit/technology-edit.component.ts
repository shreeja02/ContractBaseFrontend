import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-technology-edit',
  templateUrl: './technology-edit.component.html',
  styleUrls: ['./technology-edit.component.scss'],
})
export class TechnologyEditComponent implements OnInit {
  technologyForm!: FormGroup;
  isEdit: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TechnologyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      console.log('this.data: ', this.data);
      this.isEdit = true;
      this.technologyForm = this.fb.group({})
    }
  }

}
