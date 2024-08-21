import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvincesComponent } from './provinces.component';
import { ProvinceListComponent } from './province-list/province-list.component';
import { ProvinceEditComponent } from './province-edit/province-edit.component';

const routes: Routes = [{
  path: '',
  component: ProvincesComponent,
  children: [
    {
      path: '',
      component: ProvinceListComponent
    },
    {
      path: 'add',
      component: ProvinceEditComponent
    },
    {
      path: 'edit/:id',
      component: ProvinceEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvincesRoutingModule { }
