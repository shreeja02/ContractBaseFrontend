import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { TechnologyService } from 'src/app/shared/services/technology.service';

@Component({
  selector: 'app-technology-list-grid',
  templateUrl: './technology-list-grid.component.html',
  styleUrls: ['./technology-list-grid.component.scss'],
})
export class TechnologyListGridComponent implements OnInit {
  displayedColumns: any[] = ["technologyName", "positionName", "action"];
  dataSource: any;

  @Input() data: any[] = [];
  @Input() isActive: boolean = true;

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public dialog: MatDialog, private technologyService: TechnologyService) { }

  ngOnInit() { }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.technologyService.deleteTechnology(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.technologyService.getAllTechologies().subscribe(
                (result: any) => {
                  if (result.success) {
                    this.dataSource = new MatTableDataSource<Element>(result.result);
                  }
                }
              );
            }
          }
        );
      }
    });
  }

  setResult(ev: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  onEditCalled(element: any) {
    this.onEdit.emit(element);
  }
}
