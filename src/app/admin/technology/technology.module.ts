import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyRoutingModule } from './technology-routing';
import { TechnologyComponent } from './technology.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { TechnologyListComponent } from './technology-list/technology-list.component';


@NgModule({
  declarations: [TechnologyComponent, TechnologyListComponent],
  imports: [
    CommonModule,
    TechnologyRoutingModule,
    MaterialModule,
  ]
})
export class TechnologyModule { }
