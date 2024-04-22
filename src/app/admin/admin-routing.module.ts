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
            }]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
