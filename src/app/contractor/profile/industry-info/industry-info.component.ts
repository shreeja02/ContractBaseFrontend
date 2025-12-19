import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-industry-info',
  templateUrl: './industry-info.component.html',
  styleUrls: ['./industry-info.component.scss'],
})
export class IndustryInfoComponent implements OnInit {
  isItemAvailable = false;
  items: any[] = [];
  selectedItems: any[] = [];
  formTouched = false;
  industryForm: FormGroup;
  filteredItems: any[] = [];
  currentUser: any;
  maxIndustries = 3;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractorService: ContractorService,
    private industryService: IndustryService,
    private authService: AuthService
  ) {
    this.industryForm = this.createFormGroup();
  }

  ngOnInit() {
          this.authService.currentUser$.subscribe((data) => {
      if (data)
        this.currentUser = data;
      this.getAllIndustries();
    })
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      searchIndustry: [''],
    });
  }

  getAllIndustries() {
    this.industryService.getAllActiveIndustries().subscribe((data: any) => {
      if (data && data.success) {
        this.items = data.result;
        // Load previously selected industries
        if (this.currentUser?.industries && this.currentUser.industries.length > 0) {
          this.selectedItems = this.items
            .filter(x => this.currentUser.industries.includes(x._id))
            .slice();
        }
      }
    });
  }

  getItems(ev: any) {
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.isItemAvailable = true;
      this.filteredItems = this.items.filter((item) => {
        // Don't show already selected items
        if (this.selectedItems.findIndex(x => x._id === item._id) > -1) {
          return false;
        }
        return (item.industryName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.isItemAvailable = false;
      this.filteredItems = [];
    }
  }

  onItemSelected(item: any) {
    if (this.selectedItems.length >= this.maxIndustries) {
      return;
    }
    // Check if item is not already selected
    if (!this.selectedItems.find(val => val._id === item._id)) {
      this.selectedItems.push(item);
      this.industryForm.get('searchIndustry')?.setValue('');
      this.isItemAvailable = false;
      this.filteredItems = [];
    }
  }

  onItemSelectedRemoved(item: any) {
    const index = this.selectedItems.findIndex(x => x._id === item._id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  previous() {
    this.router.navigateByUrl('contractor/profile/business');
  }

  next() {
    this.formTouched = true;
    if (!this.selectedItems?.length || this.selectedItems.length !== this.maxIndustries) {
      return;
    }
    this.contractorService.editContractor(
      { ...this.currentUser, industries: this.selectedItems.map(x => x._id) },
      this.currentUser._id
    ).subscribe((data) => {
      if (data && data.success) {
        this.router.navigateByUrl('contractor/profile/location');
      }
    });
  }
}
