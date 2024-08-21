import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-delete-record',
  templateUrl: './delete-record.component.html',
  styleUrls: ['./delete-record.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, IonicModule]
})
export class DeleteRecordComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() { }

  onOkClick(): void {
    this.dialogRef.close({ success: true });
  }

  onCancelClick(): void {
    this.dialogRef.close({ success: false });
  }

}
