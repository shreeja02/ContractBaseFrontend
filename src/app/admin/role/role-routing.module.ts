import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

const routes: Routes = [{
  path: '',
  component: RoleComponent,
  children: [
    {
      path: '',
      component: RoleListComponent
    },
    {
      path: 'add',
      component: RoleEditComponent
    },
    {
      path: 'edit/:id',
      component: RoleEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
