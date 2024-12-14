import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocationInfoComponent } from '../location-info/location-info.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { ProfessionalInfoComponent } from '../professional-info/professional-info.component';
import { Router } from '@angular/router';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { IndustryService } from 'src/app/shared/services/industry.service';

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
  currentContractor: any;
  filteredItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractorService: ContractorService,
    private industryService: IndustryService
  ) { }

  ngOnInit() {
    this.contractorService.currentContractor$.subscribe((currentContractor) => {
      if (currentContractor) {
        this.currentContractor = currentContractor;
        this.getAllIndustries();
      }
    })
  }

  getAllIndustries() {
    this.industryService.getAllActiveIndustries().subscribe((data: any) => {
      if (data && data.success) {
        this.items = data.result;
        this.selectedItems = this.items.filter(x => this.currentContractor?.industries?.includes(x._id)).slice();
        console.log('this.selectedItems: ', this.selectedItems);
      }
    })
  }

  getItems(ev: any) {

    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.filteredItems = this.items.filter((item) => {
        if (this.selectedItems.findIndex(x => x.industryName.toLowerCase() == item.industryName.toLowerCase()) > -1) {
          return false;
        }
        return (item.industryName.toLowerCase().indexOf(val.toLowerCase()) > -1);
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
    if (!this.selectedItems.filter(val => val.industryName.toLowerCase() == item.industryName.toLowerCase()).length) {
      this.selectedItems.push(item);
      this.industryForm.get('searchIndustry')?.setValue('');
      this.isItemAvailable = false;
    }
  }

  onItemSelectedRemoved(item: any) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
  }

  previous() {
    this.router.navigateByUrl('contractor/profile/business');
  }

  next() {
    if (!this.selectedItems?.length || this.selectedItems.length != 3) return;
    this.contractorService.editContractor({ ...this.currentContractor, industries: this.selectedItems.map(x => x._id) }, this.currentContractor._id)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigateByUrl('contractor/profile/location');
        }
      });
  }

}
