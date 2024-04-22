import { Component, OnInit } from '@angular/core';
import { BusinessInfoComponent } from '../business-info/business-info.component';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  componentName: any = BusinessInfoComponent;
  constructor() { }

  ngOnInit() { }

}
