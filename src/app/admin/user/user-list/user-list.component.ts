import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserService } from 'src/app/shared/services/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteRecordComponent } from 'src/app/shared/components/delete-record/delete-record.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: any = ["firstName", "email", "phone", "cityId", "provinceId", "roleId", "action"];
  dataSource: any;
  allUsers: any;
  selectedTab: any = 0;
  activeUsers: any;
  inactiveRoles: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }
  ngAfterViewInit(): void {

  }

  onAddNewUser() {
    const dialogRef = this.dialog.open(UserEditComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllUsers();
      }
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allUsers = res.result;
          this.onTabChange({ index: this.selectedTab });
        }
      }
    );
  }



  onDeleteCalled(element: any) {
    const dialogRef = this.dialog.open(DeleteRecordComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        this.userService.deleteUser(element._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.getAllUsers();
            }
          }
        );
      }
    });
  }

  onEditCalled(element: any) {
    let data = {
      ...element,
      provinceId: element?.provinceId?._id,
      cityId: element?.cityId?._id,
      roleId: element?.roleId?._id
    }
    const dialogRef = this.dialog.open(UserEditComponent, {
      data: data,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllUsers();
      }
    });
  }

  onTabChange(event: any) {
    if (event.index == 0) {
      this.selectedTab = 0;
      this.activeUsers = this.allUsers.filter((elem: any) => elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.activeUsers);
    }
    else {
      this.selectedTab = 1;
      this.inactiveRoles = this.allUsers.filter((elem: any) => !elem.isActive);
      this.dataSource = new MatTableDataSource<Element>(this.inactiveRoles);
    }
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
