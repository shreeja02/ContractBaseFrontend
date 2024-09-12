import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RoleService } from 'src/app/shared/services/role.service';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, AfterViewInit {
  displayedColumns: any[] = ["roleName", "action"];
  dataSource: any;
  allRoles: any;
  selectedTab: any = 0;
  activeRoles: any;
  inactiveRoles: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private roleService: RoleService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllRoles();
  }
  ngAfterViewInit(): void {

  }

  onAddNewRole() {
    const dialogRef = this.dialog.open(RoleEditComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllRoles();
      }
    });
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allRoles = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.roleService.deleteRole(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllRoles();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    const dialogRef = this.dialog.open(RoleEditComponent, {
      data: element,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllRoles();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeRoles = this.allRoles.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeRoles);
    }
    else {
      this.selectedTab = 1;
      this.inactiveRoles = this.allRoles.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactiveRoles);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
