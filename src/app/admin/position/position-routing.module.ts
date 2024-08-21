import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionComponent } from './position.component';
import { PositionListComponent } from './position-list/position-list.component';
import { PositionEditComponent } from './position-edit/position-edit.component';

const routes: Routes = [{
  path: '',
  component: PositionComponent,
  children: [
    {
      path: '',
      component: PositionListComponent
    },
    {
      path: 'add',
      component: PositionEditComponent
    },
    {
      path: 'edit/:id',
      component: PositionEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule { }
