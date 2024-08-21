import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificationComponent } from './certification.component';
import { CertificationListComponent } from './certification-list/certification-list.component';
import { CertificationEditComponent } from './certification-edit/certification-edit.component';

const routes: Routes = [{
  path: '',
  component: CertificationComponent,
  children: [
    {
      path: '',
      component: CertificationListComponent
    },
    {
      path: 'add',
      component: CertificationEditComponent
    },
    {
      path: 'edit/:id',
      component: CertificationEditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificationRoutingModule { }
