import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { CityService } from 'src/app/shared/services/city.service';
import { CityEditComponent } from '../city-edit/city-edit.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit {
  displayedColumns: any[] = ["cityName", "provinceName", "action"];
  dataSource: any;
  allCities: any;
  selectedTab: any = 0;
  activeCities: any;
  inactiveCities: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private cityService: CityService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllCities();
  }
  ngAfterViewInit(): void {

  }

  onAddNewCity() {
    const dialogRef = this.dialog.open(CityEditComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllCities();
      }
    });
  }

  getAllCities() {
    this.cityService.getAllCities().subscribe(
      (res: any) => {
        if (res) {
          this.allCities = res;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.cityService.deleteCity(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllCities();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(CityEditComponent, {
      data: element,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllCities();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeCities = this.allCities.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeCities);
    }
    else {
      this.selectedTab = 1;
      this.inactiveCities = this.allCities.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactiveCities);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
