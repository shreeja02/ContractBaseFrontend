import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { IndustryInfoComponent } from './industry-info/industry-info.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { ProfessionalInfoComponent } from './professional-info/professional-info.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'basic',
        component: BasicInfoComponent
      },
      {
        path: 'business',
        component: BusinessInfoComponent
      },
      {
        path: 'industry',
        component: IndustryInfoComponent
      },
      {
        path: 'location',
        component: LocationInfoComponent
      },
      {
        path: 'professional',
        component: ProfessionalInfoComponent
      },
      {
        path: '',
        redirectTo: 'basic',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
