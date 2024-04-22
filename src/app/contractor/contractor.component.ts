import { Component, OnInit } from '@angular/core';
import { BasicInfoComponent } from './basic-info/basic-info.component';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss'],
})
export class ContractorComponent implements OnInit {
  component = BasicInfoComponent;
  constructor() { }

  ngOnInit() { }

}
