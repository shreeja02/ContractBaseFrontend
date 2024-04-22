import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IndustryInfoComponent } from '../industry-info/industry-info.component';

@Component({
  selector: 'app-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.scss'],
})
export class ProfessionalInfoComponent implements OnInit {
  professionalInfoForm = this.fb.group({
    searchIndustry: [''],
  });
  previousComponentName: any = IndustryInfoComponent;
  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

}
