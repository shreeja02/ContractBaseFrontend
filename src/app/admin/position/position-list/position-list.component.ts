import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PositionService } from 'src/app/shared/services/position.service';
import { PositionEditComponent } from '../position-edit/position-edit.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss'],
})
export class PositionListComponent implements OnInit {
  displayedColumns: any[] = ["positionName", "action"];
  dataSource: any;
  allPositions: any;
  selectedTab: any = 0;
  activePositions: any;
  inactivePositions: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private positionService: PositionService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllPositions();
  }
  ngAfterViewInit(): void {

  }

  onAddNewPosition() {
    const dialogRef = this.dialog.open(PositionEditComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllPositions();
      }
    });
  }

  getAllPositions() {
    this.positionService.getAllPositions().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allPositions = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.positionService.deletePosition(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllPositions();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(PositionEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllPositions();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activePositions = this.allPositions.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activePositions);
    }
    else {
      this.selectedTab = 1;
      this.inactivePositions = this.allPositions.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactivePositions);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
