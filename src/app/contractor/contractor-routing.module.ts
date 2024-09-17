import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorComponent } from './contractor.component';
import { ContractorRoutingGuard } from '../shared/guards/contractor-routing.guard';

const contractorRoutes: Routes = [
    {
        path: '', component: ContractorComponent, canActivate: [ContractorRoutingGuard],
        children: [
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
            }
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(contractorRoutes)],
    exports: [RouterModule]
})
export class ContractorRoutingModule { }
