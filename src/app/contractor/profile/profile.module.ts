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


@NgModule({
  declarations: [
    ProfileComponent,
    BasicInfoComponent,
    BusinessInfoComponent,
    LocationInfoComponent,
    IndustryInfoComponent,
    ProfessionalInfoComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
