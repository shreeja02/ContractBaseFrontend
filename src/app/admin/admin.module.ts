import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { IonicComponentsModule } from '../shared/ionic-components.module';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    IonicComponentsModule,
    HeaderComponent
  ]
})
export class AdminModule { }
