import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { HeaderComponent } from '../header/header.component';
import { CityComponent } from './city.component';
import { CityListComponent } from './city-list/city-list.component';
import { CityEditComponent } from './city-edit/city-edit.component';


@NgModule({
  declarations: [CityComponent, CityListComponent, CityEditComponent],
  imports: [
    CommonModule,
    CityRoutingModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule
  ]
})
export class CityModule { }
