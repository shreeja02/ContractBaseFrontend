import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorComponent } from './contractor.component';

const contractorRoutes: Routes = [
    {
        path: '', component: ContractorComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(contractorRoutes)],
    exports: [RouterModule]
})
export class ContractorRoutingModule { }
