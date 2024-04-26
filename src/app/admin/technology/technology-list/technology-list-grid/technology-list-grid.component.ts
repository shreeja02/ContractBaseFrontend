import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-technology-list-grid',
  templateUrl: './technology-list-grid.component.html',
  styleUrls: ['./technology-list-grid.component.scss'],
})
export class TechnologyListGridComponent implements OnInit, AfterViewInit {
  displayedColumns: any[] = ["technologyName", "action"];
  dataSource: any;

  @Input() data: any[] = [];
  @Input() isActive: boolean = true;

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<Element>(this.data);
  }

  onDeleteCalled(element: any) {
    this.onDelete.emit(element);
  }

  onEditCalled(element: any) {
    this.onEdit.emit(element);
  }
}
