import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractorComponent } from './contractor.component';
import { IonicComponentsModule } from '../shared/ionic-components.module';
import { ContractorRoutingModule } from './contractor-routing.module';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [ContractorComponent, HeaderComponent],
  imports: [
    CommonModule,
    IonicComponentsModule,
    ContractorRoutingModule
  ]
})
export class ContractorModule { }
