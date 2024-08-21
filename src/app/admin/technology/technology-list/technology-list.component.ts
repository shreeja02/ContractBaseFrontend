import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { TechnologyEditComponent } from '../technology-edit/technology-edit.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrls: ['./technology-list.component.scss'],
})
export class TechnologyListComponent implements OnInit {
  activeTechnologies: any[] = [];
  inActiveTechnologies: any[] = [];
  filteredActiveTechnologies: any[] = [];
  filteredInActiveTechnologies: any[] = [];
  displayedColumns: any = ["technologyName", "action"];
  selectedTab: any = 0;
  searchValue: any = '';
  constructor(private technologyService: TechnologyService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllTechnologies();
  }

  getAllTechnologies() {
    this.technologyService.getAllTechologies().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.activeTechnologies = res.result.filter((elem: any) => elem.isActive);
          this.inActiveTechnologies = res.result.filter((elem: any) => !elem.isActive);
        }
      }
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedTab = tabChangeEvent.index;
  }

  onAddNewTechnology() {
    const dialogRef = this.dialog.open(TechnologyEditComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllTechnologies();
      }
    });
  }

  onEdit(element: any) {
    const dialogRef = this.dialog.open(TechnologyEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.getAllTechnologies();
      }
    });
  }


  // onDelete(event: any) {

  // }

  // applyFilter(event: any) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   if (this.selectedTab == 0) {
  //     this.activeTechnologies = this.activeTechnologies.filter((elem) => {
  //       return (JSON.stringify(elem).toLocaleLowerCase()).match(filterValue.trim().toLowerCase())
  //     });
  //   }
  // }
}
