import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IndustryInfoComponent } from '../industry-info/industry-info.component';
import { Router } from '@angular/router';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-professional-info',
  templateUrl: './professional-info.component.html',
  styleUrls: ['./professional-info.component.scss'],
  providers: [provideNativeDateAdapter()],
})
export class ProfessionalInfoComponent implements OnInit {
  professionalInfoForm = this.fb.group({
    searchIndustry: [''],
  });
  allLocations: any = [
    { type: 'Remote', days: 0 },
    { type: 'Hybrid', days: 0 },
    { type: 'Inperson', days: 5 }
  ];
  projectBudget: any = ['<10MIO', '10MIO - 100MIO', '100MIO - 500MIO', '>500MIO'];
  teamSize: any = ['<10', '10-50', '50-100', '>100'];
  contractLength: any = ['<6 Months', '6 Months - 1 Year', '>1 Year'];

  todayDate = new Date();
  form = this.createFormGroup();
  isHybridSelected: boolean = false;
  currentUser: any;
  isLoading = false;
  currentContractor: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractorService: ContractorService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data) => {
      if (data)
        this.currentUser = data;
      this.getContractorByUserId(this.currentUser.id);
    })
  }

   getContractorByUserId(contractorId: any) {
    this.contractorService.getContractorByUserId(contractorId).subscribe(
      (data: any) => {
        if (data && data.success) {
          this.currentContractor = data.result;
          this.form = this.createFormGroup(this.currentContractor);
          
          // Set location array values
          if (this.currentContractor?.location && Array.isArray(this.currentContractor.location)) {
            this.form.get('location')?.setValue(this.currentContractor.location);
            
            // Extract hybridDays from location if hybrid exists
            const hybridLocation = this.currentContractor.location.find(
              (loc: any) => loc.type && loc.type.toLowerCase() === 'hybrid'
            );
            if (hybridLocation && hybridLocation.days !== undefined) {
              this.form.get('hybridDays')?.setValue(hybridLocation.days);
            }
          }
          
          // Check if hybrid is already in the location array
          this.checkAndSetHybrid();
        }
      }
    );
  }

  checkAndSetHybrid() {
    const locations = this.form.get('location')?.value;
    if (locations && Array.isArray(locations) && locations.length > 0) {
      const hasHybrid = locations.find((loc: any) => loc.type && loc.type.toLowerCase() === 'hybrid');
      this.isHybridSelected = !!hasHybrid;
    }
  }

  compareLocationObjects(loc1: any, loc2: any): boolean {
    if (!loc1 || !loc2) return loc1 === loc2;
    return loc1.type?.toLowerCase() === loc2.type?.toLowerCase();
  }

  createFormGroup(dataItem: any = {}) {
    return this.fb.group({
      location: [dataItem?.location || [], Validators.required],
      yearsOfExperience: [dataItem?.yearsOfExperience || 0, [Validators.required, Validators.min(1)]],
      hourlyRate: [dataItem?.hourlyRate || 0, [Validators.required, Validators.min(1)]],
      projectBudget: [dataItem?.projectBudget || [], Validators.required],
      teamSize: [dataItem?.teamSize || [], Validators.required],
      contractLength: [dataItem?.contractLength || [], Validators.required],
      availableDate: [dataItem?.availableDate ? new Date(dataItem?.availableDate) : new Date(), Validators.required],
      hybridDays: [dataItem?.hybridDays || 0, [Validators.min(0), Validators.max(5)]],
    });
  }

  hybridSelected(e: any) {
    this.isHybridSelected = e.detail.checked;
  }

  handleChange(event: any) {
    let selectedValues = event.target.value;
    if (selectedValues && selectedValues.length > 0) {
      let find = selectedValues.find((elem: any) => {
        if (typeof elem === 'string') {
          return elem.toLowerCase() === 'hybrid';
        }
        return elem.type && elem.type.toLowerCase() === 'hybrid';
      });
      this.isHybridSelected = !!find;
    } else {
      this.isHybridSelected = false;
      this.form.get('hybridDays')?.clearValidators();
      this.form.get('hybridDays')?.updateValueAndValidity();
    }
  }

  previous() {
    this.router.navigateByUrl('contractor/profile/location');
  }

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Completing profile...',
      spinner: 'crescent'
    });
    await loading.present();

    let formData = { ...this.currentContractor, ...this.form.value };
    if (this.isHybridSelected) {
      formData.location = [...this.form.value.location.filter((loc: any) => loc.type.toLowerCase() !== 'hybrid'),
      { type: 'Hybrid', days: this.form.value.hybridDays }];
    }   
    this.contractorService.editContractor(formData, this.currentUser.id)
      .subscribe(
        (data) => {
          this.isLoading = false;
          loading.dismiss();
          if (data && data.success) {
            this.router.navigateByUrl('contractor/profile/view');
          }
        },
        (error) => {
          this.isLoading = false;
          loading.dismiss();
        }
      );
  }

}
