import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryComponent } from './industry.component';
import { IndustryEditComponent } from './industry-edit/industry-edit.component';
import { IndustryListComponent } from './industry-list/industry-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndustryComponent,
    children: [
      {
        path: '',
        component: IndustryListComponent
      },
      {
        path: 'add',
        component: IndustryEditComponent
      },
      {
        path: 'edit/:id',
        component: IndustryEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryRoutingModule { }
