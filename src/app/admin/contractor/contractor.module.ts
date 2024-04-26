import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractorRoutingModule } from './contractor-routing.module';
import { ContractorListComponent } from './contractor-list/contractor-list.component';
import { ContractorComponent } from './contractor.component';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { HeaderComponent } from '../header/header.component';
import { ContractorDetailsComponent } from './contractor-details/contractor-details.component';


@NgModule({
  declarations: [ContractorListComponent, ContractorComponent, ContractorDetailsComponent],
  imports: [
    CommonModule,
    ContractorRoutingModule,
    HeaderComponent,
    IonicComponentsModule
  ]
})
export class ContractorModule { }
