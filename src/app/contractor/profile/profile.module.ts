import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { IndustryInfoComponent } from './industry-info/industry-info.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { ProfessionalInfoComponent } from './professional-info/professional-info.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    ProfileComponent,
    BasicInfoComponent,
    BusinessInfoComponent,
    LocationInfoComponent,
    IndustryInfoComponent,
    ProfessionalInfoComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    IonicComponentsModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class ProfileModule { }
