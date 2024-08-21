import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionRoutingModule } from './position-routing.module';
import { PositionComponent } from './position.component';
import { PositionListComponent } from './position-list/position-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { PositionEditComponent } from './position-edit/position-edit.component';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PositionComponent, PositionListComponent, PositionEditComponent],
  imports: [
    CommonModule,
    PositionRoutingModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule
  ]
})
export class PositionModule { }
