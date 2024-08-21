import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { HeaderComponent } from '../header/header.component';
import { RoleComponent } from './role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleEditComponent } from './role-edit/role-edit.component';


@NgModule({
  declarations: [RoleComponent, RoleListComponent, RoleEditComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    HeaderComponent,
    IonicComponentsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class RoleModule { }
