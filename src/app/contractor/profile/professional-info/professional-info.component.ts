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
  allLocations: any = ['Remote', 'Hybrid', 'Inperson'];
  projectBudget: any = ['<10MIO', '10MIO - 100MIO', '100MIO - 500MIO', '>500MIO'];
  teamSize: any = ['<10', '10-50', '50-100', '>100'];
  contractLength: any = ['<6 Months', '6 Months - 1 Year', '>1 Year'];

  todayDate = new Date();
  form = this.createFormGroup();
  isHybridSelected: boolean = false;
  currentUser: any;
  isLoading = false;

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
             this.form = this.createFormGroup(this.currentUser);
                this.form = this.createFormGroup(this.currentUser
                );

    })
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
    });
  }

  hybridSelected(e: any) {
    this.isHybridSelected = e.detail.checked;
  }

  handleChange(event: any) {
    let selectedValues = event.target.value;
    if (selectedValues.length > 0) {
      let find = selectedValues.find((elem: any) => elem.toLowerCase() == 'hybrid');
      if (find) {
        this.isHybridSelected = true;
      }
      else {
        this.isHybridSelected = false;
        this.form.get('hybridDays')?.removeValidators(Validators.required);
      }
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

    this.contractorService.editContractor({ ...this.currentUser, ...this.form.value }, this.currentUser._id)
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
