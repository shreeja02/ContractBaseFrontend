import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryComponent } from './industry.component';
import { IndustryListComponent } from './industry-list/industry-list.component';
import { IndustryEditComponent } from './industry-edit/industry-edit.component';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { IndustryRoutingModule } from './industry-routing.module';


@NgModule({
  declarations: [IndustryComponent, IndustryListComponent, IndustryEditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule,
    IndustryRoutingModule
  ]
})
export class IndustryModule { }
