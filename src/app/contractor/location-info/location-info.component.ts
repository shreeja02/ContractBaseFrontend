import { Component, OnInit } from '@angular/core';
import { IndustryInfoComponent } from '../industry-info/industry-info.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss'],
})
export class LocationInfoComponent implements OnInit {
  isHybridSelected: boolean = false;
  nextComponentName: any = IndustryInfoComponent;
  previousComponentName: any = BusinessInfoComponent;
  constructor() { }

  ngOnInit() { }

  hybridSelected(e: any) {
    this.isHybridSelected = e.detail.checked;
  }

}
