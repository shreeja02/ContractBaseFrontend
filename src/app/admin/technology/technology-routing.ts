import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnologyComponent } from './technology.component';
import { TechnologyListComponent } from './technology-list/technology-list.component';
import { TechnologyEditComponent } from './technology-edit/technology-edit.component';


const technologyRoutes: Routes = [
    {
        path: '',
        component: TechnologyComponent,
        children: [
            {
                path: '',
                component: TechnologyListComponent
            },
            {
                path: 'edit/:id',
                component: TechnologyEditComponent
            },
            {
                path: 'add',
                component: TechnologyEditComponent
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
