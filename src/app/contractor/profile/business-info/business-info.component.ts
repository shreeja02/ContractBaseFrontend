import { Component, OnInit } from '@angular/core';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { LocationInfoComponent } from '../location-info/location-info.component';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss'],
})
export class BusinessInfoComponent implements OnInit {
  previousComponentName: any = BasicInfoComponent;
  nextComponentName: any = LocationInfoComponent;
  constructor() { }

  ngOnInit() { }

}
