import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { IonicComponentsModule } from '../shared/ionic-components.module';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    IonicComponentsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
