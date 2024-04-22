import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const authRoutes: Routes = [
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'login', component: LoginComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
