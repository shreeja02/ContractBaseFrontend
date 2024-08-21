import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvincesRoutingModule } from './provinces-routing.module';
import { ProvincesComponent } from './provinces.component';
import { ProvinceListComponent } from './province-list/province-list.component';
import { ProvinceEditComponent } from './province-edit/province-edit.component';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';


@NgModule({
  declarations: [ProvincesComponent, ProvinceListComponent, ProvinceEditComponent],
  imports: [
    CommonModule,
    ProvincesRoutingModule,
    HeaderComponent,
    ReactiveFormsModule,
    MaterialModule,
    IonicComponentsModule
  ]
})
export class ProvincesModule { }
