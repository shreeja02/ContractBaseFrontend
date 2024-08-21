import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificationRoutingModule } from './certification-routing.module';
import { CertificationComponent } from './certification.component';
import { CertificationListComponent } from './certification-list/certification-list.component';
import { CertificationEditComponent } from './certification-edit/certification-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { HeaderComponent } from '../header/header.component';


@NgModule({
  declarations: [CertificationComponent, CertificationListComponent, CertificationEditComponent],
  imports: [
    CommonModule,
    CertificationRoutingModule,
    CommonModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule
  ]
})
export class CertificationModule { }
