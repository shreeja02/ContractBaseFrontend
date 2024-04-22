import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractorComponent } from './contractor.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { IonicComponentsModule } from '../shared/ionic-components.module';
import { ContractorRoutingModule } from './contractor-routing.module';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { IndustryInfoComponent } from './industry-info/industry-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfessionalInfoComponent } from './professional-info/professional-info.component';



@NgModule({
  declarations: [ContractorComponent,
    BasicInfoComponent,
    BusinessInfoComponent,
    LocationInfoComponent,
    IndustryInfoComponent,
    ProfessionalInfoComponent],
  imports: [
    CommonModule,
    IonicComponentsModule,
    ContractorRoutingModule,
    ReactiveFormsModule
  ]
})
export class ContractorModule { }
