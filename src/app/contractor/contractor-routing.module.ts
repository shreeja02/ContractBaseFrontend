import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorComponent } from './contractor.component';
import { ContractorRoutingGuard } from '../shared/guards/contractor-routing.guard';

const contractorRoutes: Routes = [
    {
        path: '', component: ContractorComponent, canActivate: [ContractorRoutingGuard]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(contractorRoutes)],
    exports: [RouterModule]
})
export class ContractorRoutingModule { }
