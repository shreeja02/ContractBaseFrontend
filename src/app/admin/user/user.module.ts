import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicComponentsModule } from 'src/app/shared/ionic-components.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { HeaderComponent } from '../header/header.component';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';


@NgModule({
  declarations: [UserComponent, UserListComponent, UserEditComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    IonicComponentsModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserModule { }
