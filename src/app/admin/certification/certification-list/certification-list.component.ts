import { Component, OnInit, ViewChild } from '@angular/core';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { CertificationEditComponent } from '../certification-edit/certification-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss'],
})
export class CertificationListComponent implements OnInit {
  displayedColumns: any[] = ["certificationName", "positionName", "action"];
  dataSource: any;
  allCertifications: any;
  selectedTab: any = 0;
  activeCertifications: any[] = [];
  inActiveCertifications: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private certificationService: CertificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllCertifications();
  }

  onAddNewCertification() {
    const dialogRef = this.dialog.open(CertificationEditComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllCertifications();
      }
    });
  }

  getAllCertifications() {
    this.certificationService.getAllCertifications().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCertifications = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.certificationService.deleteCertification(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllCertifications();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(CertificationEditComponent, {
      data: element,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllCertifications();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeCertifications = this.allCertifications.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeCertifications);
    }
    else {
      this.selectedTab = 1;
      this.inActiveCertifications = this.allCertifications.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inActiveCertifications);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
