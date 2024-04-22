import { Component, OnInit } from '@angular/core';
import { TechnologyService } from 'src/app/shared/services/technology.service';

@Component({
  selector: 'app-technology-list',
  templateUrl: './technology-list.component.html',
  styleUrls: ['./technology-list.component.scss'],
})
export class TechnologyListComponent implements OnInit {
  activeTechnologies: any[] = [];
  inActiveTechnologies: any[] = [];
  constructor(private technologyService: TechnologyService) { }

  ngOnInit() { }

  getAllTechnologies() {
    this.technologyService.getAllTechologies().subscribe(
      (res: any) => {
        if (res.response.length) {
          this.activeTechnologies = res.response.filter((elem: any) => elem.isActive);
          this.inActiveTechnologies = res.response.filter((elem: any) => !elem.isActive);
        }
      }
    );
  }
}
