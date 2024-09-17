import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocationInfoComponent } from '../location-info/location-info.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { ProfessionalInfoComponent } from '../professional-info/professional-info.component';

@Component({
  selector: 'app-industry-info',
  templateUrl: './industry-info.component.html',
  styleUrls: ['./industry-info.component.scss'],
})
export class IndustryInfoComponent implements OnInit {
  isItemAvailable = false;
  items: any[] = [];
  selectedItems: any[] = [];
  industryForm = this.fb.group({
    searchIndustry: [''],
  });
  previousComponentName: any = LocationInfoComponent;
  nextComponentName: any = ProfessionalInfoComponent;
  threeIndustriesAreAdded: boolean = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit() { }

  initializeItems() {
    this.items = ["Information Technology", "Finance and Banking", "Healthcare", "Telecommunication", "Administrative"];
  }

  getItems(ev: any) {
    this.initializeItems();

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.isItemAvailable = false;
    }
  }

  onItemSelected(item: any) {
    if (this.selectedItems.length === 3) {
      this.threeIndustriesAreAdded = true;
      return;
    }
    if (!this.selectedItems.filter(val => val.toLowerCase() == item.toLowerCase()).length) {
      this.selectedItems.push(item);
      this.industryForm.get('searchIndustry')?.setValue('');
      this.isItemAvailable = false;
    }
  }

  onItemSelectedRemoved(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
  }

}
