import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorComponent } from './contractor.component';
import { ContractorListComponent } from './contractor-list/contractor-list.component';
import { ContractorDetailsComponent } from './contractor-details/contractor-details.component';
import { ContractorEditComponent } from './contractor-edit/contractor-edit.component';

const contractorRoutes: Routes = [
    {
        path: '',
        component: ContractorComponent,
        children: [
            {
                path: '',
                component: ContractorListComponent
            },
            {
                path: 'details/:id',
                component: ContractorDetailsComponent
            },
            {
                path: 'add',
                component: ContractorEditComponent
            },
            {
                path: 'edit/contractor/:id',
                component: ContractorEditComponent
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
