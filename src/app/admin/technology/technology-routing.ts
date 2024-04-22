import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnologyComponent } from './technology.component';
import { TechnologyListComponent } from './technology-list/technology-list.component';


const technologyRoutes: Routes = [
    {
        path: '',
        component: TechnologyComponent,
        children: [
            {
                path: '',
                component: TechnologyListComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(technologyRoutes)],
    exports: [RouterModule]
})
export class TechnologyRoutingModule { }
