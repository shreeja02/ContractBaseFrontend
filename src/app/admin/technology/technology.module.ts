import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnologyRoutingModule } from './technology-routing';
import { TechnologyComponent } from './technology.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { TechnologyListComponent } from './technology-list/technology-list.component';
import { TechnologyListGridComponent } from './technology-list/technology-list-grid/technology-list-grid.component';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { HeaderComponent } from '../header/header.component';
import { TechnologyEditComponent } from './technology-edit/technology-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterDataPipe } from 'src/app/shared/pipes/filter-data.pipe';

@NgModule({
  declarations: [TechnologyComponent,
    TechnologyListComponent, TechnologyListGridComponent, TechnologyEditComponent, FilterDataPipe],
  imports: [
    CommonModule,
    TechnologyRoutingModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TechnologyModule { }
