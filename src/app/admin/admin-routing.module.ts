import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [
    {
        path: '', component: AdminComponent, children: [
            {
                path: 'contractor', loadChildren: () => import('./contractor/contractor.module').then(m => m.ContractorModule)
            },
            {
                path: 'technology', loadChildren: () => import('./technology/technology.module').then(m => m.TechnologyModule)
            },
            {
                path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
            },
            {
                path: 'position', loadChildren: () => import('./position/position.module').then(m => m.PositionModule)
            },
            {
                path: 'industry', loadChildren: () => import('./industry/industry.module').then(m => m.IndustryModule)
            },
            {
                path: 'certification', loadChildren: () => import('./certification/certification.module').then(m => m.CertificationModule)
            },
            {
                path: 'province', loadChildren: () => import('./provinces/provinces.module').then(m => m.ProvincesModule)
            },
            {
                path: 'city', loadChildren: () => import('./city/city.module').then(m => m.CityModule)
            },
            {
                path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            }]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
