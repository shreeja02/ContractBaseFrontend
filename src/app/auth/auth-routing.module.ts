import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const authRoutes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'signup', component: SignupComponent
    },
    {
        path: 'login', component: LoginComponent, canActivate: [AuthGuard]
    },
    {
        path: 'forgot-password', component: ForgotPasswordComponent
    },
    {
        path: 'reset-password', component: ResetPasswordComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
