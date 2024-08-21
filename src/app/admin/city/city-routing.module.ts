import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';
import { CityListComponent } from './city-list/city-list.component';
import { CityEditComponent } from './city-edit/city-edit.component';

const routes: Routes = [{
  path: '',
  component: CityComponent,
  children: [
    {
      path: '',
      component: CityListComponent
    },
    {
      path: 'add',
      component: CityEditComponent
    },
    {
      path: 'edit/:id',
      component: CityEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
