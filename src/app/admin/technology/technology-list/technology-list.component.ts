import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { TechnologyEditComponent } from '../technology-edit/technology-edit.component';

@Component({
  selector: 'app-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrls: ['./technology-list.component.scss'],
})
export class TechnologyListComponent implements OnInit {
  activeTechnologies: any[] = [];
  inActiveTechnologies: any[] = [];
  displayedColumns: any = ["technologyName", "action"]
  constructor(private technologyService: TechnologyService,
    private router: Router,
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

  onAddNewTechnology() {
    this.router.navigate(['/admin/technology/add']);
  }

  onEdit(element: any) {
    const dialogRef = this.dialog.open(TechnologyEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  onDelete(event: any) {
    console.log('event: ', event);
  }
}
