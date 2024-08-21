import { Component, OnInit, ViewChild } from '@angular/core';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { ProvinceEditComponent } from '../province-edit/province-edit.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html',
  styleUrls: ['./province-list.component.scss'],
})
export class ProvinceListComponent implements OnInit {
  displayedColumns: any[] = ["roleName", "action"];
  dataSource: any;
  allProvinces: any;
  selectedTab: any = 0;
  activeProvinces: any;
  inactiveProvinces: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private provinceService: ProvinceService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllProvinces();
  }
  ngAfterViewInit(): void {

  }

  onAddNewProvince() {
    const dialogRef = this.dialog.open(ProvinceEditComponent);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllProvinces();
      }
    });
  }

  getAllProvinces() {
    this.provinceService.getAllProvinces().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allProvinces = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.provinceService.deleteProvince(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllProvinces();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(ProvinceEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.getAllProvinces();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeProvinces = this.allProvinces.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeProvinces);
    }
    else {
      this.selectedTab = 1;
      this.inactiveProvinces = this.allProvinces.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactiveProvinces);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
