import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss'],
})
export class ContractorComponent implements OnInit {
  component = ProfileComponent;
  constructor() { }

  ngOnInit() { }

}
