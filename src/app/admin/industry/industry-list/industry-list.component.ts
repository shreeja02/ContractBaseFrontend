import { Component, OnInit, ViewChild } from '@angular/core';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { IndustryEditComponent } from '../industry-edit/industry-edit.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-industry-list',
  templateUrl: './industry-list.component.html',
  styleUrls: ['./industry-list.component.scss'],
})
export class IndustryListComponent implements OnInit {

  displayedColumns: any[] = ["industryName", "action"];
  dataSource: any;
  allIndustries: any;
  selectedTab: any = 0;
  activeIndustries: any;
  inactiveIndustries: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private industryService: IndustryService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllIndustries();
  }

  onAddNewIndustry() {
    const dialogRef = this.dialog.open(IndustryEditComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllIndustries();
      }
    });
  }

  getAllIndustries() {
    this.industryService.getAllIndustries().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allIndustries = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.industryService.deleteIndustry(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllIndustries();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(IndustryEditComponent, {
      data: element,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllIndustries();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeIndustries = this.allIndustries.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeIndustries);
    }
    else {
      this.selectedTab = 1;
      this.inactiveIndustries = this.allIndustries.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactiveIndustries);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
