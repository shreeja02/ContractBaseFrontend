import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingController } from '@ionic/angular';

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
  isLoading = false;
  currentContractor: any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractorService: ContractorService,
    private industryService: IndustryService,
    private authService: AuthService,
      private loadingController: LoadingController
  ) {
    this.industryForm = this.createFormGroup();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        // First get contractor data, then load industries
        this.getContractorByUserId(this.currentUser.id);
      }
    });
  }

  getContractorByUserId(contractorId: any) {
    this.contractorService.getContractorByUserId(contractorId).subscribe(
      (data: any) => {
        if (data && data.success) {
          this.currentContractor = data.result;
          // Load industries after contractor is fetched
          this.getAllIndustries();
        }
      }
    );
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
        
        // Load previously selected industries from currentContractor
        if (this.currentContractor?.industries && this.currentContractor.industries.length > 0) {
          // Handle both object IDs and string IDs
          const selectedIndustryIds = this.currentContractor.industries.map((ind:any) => 
            typeof ind === 'string' ? ind : (typeof ind === 'object' ? ind._id : ind)
          );
          
          this.selectedItems = this.items.filter(item => 
            selectedIndustryIds.includes(item._id)
          );
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

  async next() {
    this.formTouched = true;
    if (!this.selectedItems?.length || this.selectedItems.length !== this.maxIndustries) {
      return;
    }
    
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Saving industries...',
      spinner: 'circular'
    });
    await loading.present();
    
    // Update currentContractor with selected industries
    const updatedContractor = {
      ...this.currentContractor,
      industries: this.selectedItems.map(x => x._id)
    };
    
    this.contractorService.editContractor(
      updatedContractor,
      this.currentContractor._id
    ).subscribe(
      (data) => {
        this.isLoading = false;
        loading.dismiss();
        if (data && data.success) {
          this.router.navigateByUrl('contractor/profile/location');
        }
      },
      (error) => {
        this.isLoading = false;
        loading.dismiss();
      }
    );
  }
}
