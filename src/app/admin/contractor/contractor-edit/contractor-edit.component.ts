import { ChangeDetectorRef, Component, computed, inject, Inject, model, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { finalize, map, Observable, startWith, Subscription } from 'rxjs';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { PositionService } from 'src/app/shared/services/position.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { UserService } from 'src/app/shared/services/user.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  styleUrls: ['./contractor-edit.component.scss'],
  providers: [provideNativeDateAdapter()],
})
export class ContractorEditComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  myControl = new FormControl<string | any>('', Validators.required);
  hybridDays = new FormControl<number | any>(1, Validators.required);
  contractorForm!: FormGroup;
  isEdit: boolean = false;
  errorMessage: any;
  allContractors: any[] = [];
  filteredContractors!: Observable<any[]>;
  selectedUser = '';
  selectedUserData: any;
  allPositions: any = [];
  allProvinces: any = [];
  allCities: any = [];
  allIndustries: any = [];
  hybridSelected = false;
  todayDate: Date = new Date();
  allLocations: any = [{ type: 'Remote', days: 0 }, { type: 'Inperson', days: 5 }, { type: 'Hybrid', days: 0 }];
  projectBudget: any = ['<10MIO', '10MIO - 100MIO', '100MIO - 500MIO', '>500MIO'];
  teamSize: any = ['<10', '10-50', '50-100', '>100'];
  contractLength: any = ['<6 Months', '6 Months - 1 Year', '>1 Year'];
  industrySelectionErrorMessage = '';
  technologySelectionErrorMessage = '';
  certificationSelectionErrorMessage = '';

  allTechnologies: any = [];
  allCerifications: any;
  showCalendar: boolean = false;
  readonly currentTechnology = model('');
  filteredTechnologies: any;
  loading: boolean = false;
  isTechnologyAvailable: boolean = false;
  isIndustryAvailable: boolean = false;
  isCertificationAvailable: boolean = false;
  technologies = signal(['']);
  readonly announcer = inject(LiveAnnouncer);
  selectedTechnologies: any = [];
  selectedIndustries: any = [];
  selectedCertifications: any = [];
  filteredIndustries: any = [];
  filteredCertifications: any = [];
  threeTechnologiesAreAdded: boolean = false;
  routeSub!: Subscription;
  contractorId: any;
  contractorDetails: any;
  @ViewChild('industrySearchbar') industrySearchbar: any;
  @ViewChild('technologySearchbar') technologySearchbar: any;
  @ViewChild('certificationSearchbar') certificationSearchbar: any;
  constructor(private fb: FormBuilder,
    private contractorService: AdminService,
    private userService: UserService,
    private positionService: PositionService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private router: Router,
    private industryService: IndustryService,
    private technologyService: TechnologyService,
    private certificationService: CertificationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) {
    this.routeSub = this.route.params.subscribe(params => {
      this.contractorId = params['id'];
      if (this.contractorId) {
        this.isEdit = true;
      }
      else {
        this.isEdit = false;
        this.contractorForm = this.createForm();
      }
    });
  }

  getContractorById() {
    this.contractorService.getContractorById(this.contractorId).subscribe(
      (data: any) => {
        this.contractorDetails = data.result;
        if (this.contractorDetails) {
          this.contractorForm = this.createForm(this.contractorDetails);
          this.cdr.detectChanges();
          if (this.contractorDetails.businessProvinceId) {

            this.cityService.getCitiesByProvince(this.contractorDetails?.businessProvinceId).subscribe(
              (res: any) => {
                if (res.result && res.result.length) {
                  this.allCities = res.result;
                  this.contractorForm.get('businessCityId')?.setValue(this.contractorDetails.businessCityId?._id);
                  this.cdr.detectChanges();
                }
              }
            );
          }

          this.handleChangeForPosition(this.contractorDetails.position, true);
          this.selectedTechnologies = this.contractorDetails.technologies;

          if (this.contractorDetails.industries) {
            const industryIds = this.contractorDetails.industries.map((ind: any) =>
              typeof ind === 'string' ? ind : ind._id
            );
            this.contractorForm.get('industries')?.setValue(industryIds);
            this.selectedIndustries = this.contractorDetails.industries.map((ind: any) =>
              typeof ind === 'string' ? { _id: ind } : ind
            );
          }

          if (this.contractorDetails.certifications) {
            const certIds = this.contractorDetails.certifications.map((cert: any) =>
              typeof cert === 'string' ? cert : cert._id
            );
            this.contractorForm.get('certifications')?.setValue(certIds);
            this.selectedCertifications = this.contractorDetails.certifications.map((cert: any) =>
              typeof cert === 'string' ? { _id: cert } : cert
            );
          }

          if (this.contractorDetails.location && Array.isArray(this.contractorDetails.location)) {
            this.contractorForm.get('location')?.setValue(this.contractorDetails.location);
            const hasHybrid = this.contractorDetails.location.find(
              (loc: any) => loc.type && loc.type.toLowerCase() === 'hybrid'
            );
            if (hasHybrid) {
              this.hybridSelected = true;
              this.hybridDays.setValue(hasHybrid.days);
            }
          }

          this.cdr.detectChanges();
        }
      }
    );
  }

  ngOnInit() {
    this.getAllContractorsFromUser();
    this.filteredContractors = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.firstName + ' ' + value?.lastName;
        return name ? this._filter(name as string) : this.allContractors.slice();
      }),
    );
    this.getAllPositions();
    this.getAllActiveCities();
    this.getAllProvinces();
    this.getAllIndustries();
    this.getAllCertifications();
    this.getAllActiveCities();

    // Call getContractorById for edit mode after data is loaded
    if (this.isEdit && this.contractorId) {
      this.getContractorById();
    }
  }

  getAllActiveCities() {
    this.cityService.getAllCities().subscribe(
      (res: any) => {
        if (res.length) {
          this.allCities = res;
        }
      }
    );
  }

  getAllCertifications() {
    this.certificationService.getAllCertifications().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCerifications = res.result;
        }
      }
    );
  }

  getAllIndustries() {
    this.industryService.getAllIndustries().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allIndustries = res.result;
        }
      }
    );
  }

  getAllProvinces() {
    this.provinceService.getAllActiveProvinces().subscribe(
      (res: any) => {
        if (res.length) {
          this.allProvinces = res;
        }
      }
    );
  }

  handleChangeForProvince(event: any, fromEdit = false) {
    let provinceId = fromEdit ? event : event.detail.value;
    this.cityService.getCitiesByProvince(provinceId).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCities = res.result;
        }
      }
    );
  }

  getAllPositions() {
    this.positionService.getAllActivePositions().subscribe((res: any) => {
      if (res.result.length) {
        this.allPositions = res.result;
      }
    },
      (err) => {
        console.log(err);
      });
  }

  getAllContractorsFromUser() {
    this.userService.getAllActiveContractorFromUser().subscribe((res: any) => {
      if (res.result.length) {
        this.allContractors = res.result;
      }
    },
      (err) => {
        console.log(err);
      });
  }

  onBack() {
    this.contractorForm.get('cityName')?.markAsUntouched();
    this.contractorForm.get('cityName')?.clearValidators();
    this.contractorForm.get('cityName')?.updateValueAndValidity();
    this.router.navigate(['/admin/contractor']);
  }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        userId: new FormControl(formValues?.userId?._id || '', Validators.required),
        linkedInProfile: new FormControl(formValues?.linkedInProfile || '', Validators.required),
        businessNumber: new FormControl(formValues?.businessNumber || '', Validators.required),
        businessAddressLine1: new FormControl(formValues?.businessAddressLine1 || '', Validators.required),
        businessAddressLine2: new FormControl(formValues?.businessAddressLine2),
        businessProvinceId: new FormControl(
          formValues?.businessProvinceId?._id || '',
          Validators.required
        ),
        businessCityId: new FormControl(
          formValues?.businessCityId?._id || '',
          Validators.required
        ),
        businessZipCode: new FormControl(formValues?.businessZipCode || '', Validators.required),
        position: new FormControl(formValues?.position?._id || '', Validators.required),
        industries: new FormControl(formValues?.industries || [], Validators.required),
        technologies: new FormControl(formValues?.technologies || [], Validators.required),
        certifications: new FormControl(formValues?.certifications || [], Validators.required),
        location: new FormControl(formValues?.location || [], Validators.required),
        yearsOfExperience: new FormControl(formValues?.yearsOfExperience || 0, Validators.required),
        hourlyRate: new FormControl(formValues?.hourlyRate || 0, Validators.required),
        projectBudget: new FormControl(formValues?.projectBudget || [], Validators.required),
        teamSize: new FormControl(formValues?.teamSize || [], Validators.required),
        contractLength: new FormControl(formValues?.contractLength || [], Validators.required),
        availableDate: new FormControl(formValues?.availableDate || '', Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

  displayFn(user: any): string {
    this.myControl?.setValue(user._id);
    return user && user.firstName ? user.firstName + ' ' + user.lastName : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allContractors.filter(option => option.firstName.toLowerCase().includes(filterValue));
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
      this.hybridSelected = !!find;
    } else {
      this.hybridSelected = false;
      this.hybridDays?.removeValidators(Validators.required);
    }
  }

  compareLocationObjects(loc1: any, loc2: any): boolean {
    if (!loc1 || !loc2) return loc1 === loc2;
    return loc1.type?.toLowerCase() === loc2.type?.toLowerCase();
  }

  onSave() {
    // Validate form fields
    

    // Validate industries selection
    if (!this.selectedIndustries || this.selectedIndustries.length === 0) {
      this.industrySelectionErrorMessage = 'Please select at least 1 industry.';
      return;
    }
    if (this.selectedIndustries.length > 3) {
      this.industrySelectionErrorMessage = 'Please select maximum 3 industries.';
      return;
    }

    // Validate technologies selection
    if (!this.selectedTechnologies || this.selectedTechnologies.length === 0) {
      this.technologySelectionErrorMessage = 'Please select at least 1 technology.';
      return;
    }
    if (this.selectedTechnologies.length > 3) {
      this.technologySelectionErrorMessage = 'Please select maximum 3 technologies.';
      return;
    }

    // Validate certifications selection
    if (!this.selectedCertifications || this.selectedCertifications.length === 0) {
      this.certificationSelectionErrorMessage = 'Please select at least 1 certification.';
      return;
    }
    if (this.selectedCertifications.length > 3) {
      this.certificationSelectionErrorMessage = 'Please select maximum 3 certifications.';
      return;
    }

    // Validate location selection
    const locationValue = this.contractorForm.get('location')?.value;
    if (!locationValue || (Array.isArray(locationValue) && locationValue.length === 0)) {
      console.error('Please select at least one work location.');
      return;
    }

    // Validate hybrid days if hybrid is selected
    if (this.hybridSelected) {
      const hybridDaysValue = this.hybridDays?.value;
      if (!hybridDaysValue || hybridDaysValue <= 0 || hybridDaysValue > 5) {
        console.error('Please enter valid number of office days per week (1-5).');
        return;
      }
    }

    if (this.hybridSelected) {
      var foundIndex = this.allLocations.findIndex((x: any) => x.type == 'Hybrid');
      this.allLocations[foundIndex].days = this.hybridDays?.value || 0;
    }
    if (!this.isEdit) {
      this.contractorForm.get('userId')?.setValue((this.myControl.value)?._id);
    }
    this.contractorForm.get('technologies')?.setValue(this.selectedTechnologies.map((x: any) => x._id));
    this.contractorForm.get('industries')?.setValue(this.selectedIndustries.map((x: any) => x._id));
    this.contractorForm.get('certifications')?.setValue(this.selectedCertifications.map((x: any) => x._id));

    if (this.contractorForm.invalid) {
      this.markFormGroupTouched(this.contractorForm);
      return;
    }
    this.loading = true;
    if (this.isEdit) {
      this.contractorService.editContractor(this.contractorForm.value, this.contractorId)
        .pipe(finalize(() => this.loading = false))
        .subscribe(
          (data: any) => {
            if (data.status == 200) {
              this.router.navigate(['/admin/contractor']);
            }
          },
          (error: any) => {
          }
        )
    }
    else {
      let data ={
        ...this.contractorForm.value, userId: this.myControl.value?._id
      }
      this.contractorService.saveContractor(data)
        .pipe(finalize(() => this.loading = false))
        .subscribe(
          (data: any) => {
            if (data.status == 200) {
              this.router.navigate(['/admin/contractor']);
            }
          },
          (error: any) => {
            console.error('Error saving contractor:', error);
          }
        )
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  handleChangeForIndustries(event: any) {
    let selectedIndustries = event.target.value;
    if (selectedIndustries.length > 3) {
      this.industrySelectionErrorMessage = 'Please select maximum 3 industries.';
    }
    else {
      this.industrySelectionErrorMessage = '';
    }
  }

  getTechnologiesByPosition(id: any) {
    this.technologyService.getTechnologiesByPositionId(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allTechnologies = res.result;
        }
      }
    );
  }

  getCertificationByPosition(id: any) {
    this.certificationService.getCertificationByPosition(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCerifications = res.result;
        }
      }
    );
  }

  handleChangeForPosition(event: any, fromEdit = false) {
    let position = fromEdit ? event : event.target.value;
    this.getTechnologiesByPosition(position?._id || position);
    this.getCertificationByPosition(position?._id || position);
  }

  handleChangeForTechnologies(event: any) {
    let selectedTechnologies = event.target.value;
    if (selectedTechnologies.length > 3) {
      this.technologySelectionErrorMessage = 'Please select maximum 3 technologies.';
    }
    else {
      this.technologySelectionErrorMessage = '';
    }
  }

  handleChangeForCertifications(event: any) {
    let selectedCertifications = event.target.value;
    if (selectedCertifications.length > 3) {
      this.certificationSelectionErrorMessage = 'Please select maximum 3 certifications.';
    }
    else {
      this.certificationSelectionErrorMessage = '';
    }
  }

  openDateSelection() {
    this.showCalendar = true;
  }

  cancelCalendar() { }

  getTechnologies(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.isTechnologyAvailable = true;
      this.filteredTechnologies = this.allTechnologies.filter((item: any) => {
        return ((item?.technologyName).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.isTechnologyAvailable = false;
    }
  }

  onTechnologySelected(item: any) {
    if (this.selectedTechnologies.length === 3) {
      this.threeTechnologiesAreAdded = true;
      return;
    }
    if (!this.selectedTechnologies.filter((val: any) => (val?.technologyName).toLowerCase() == (item?.technologyName).toLowerCase()).length) {
      this.selectedTechnologies.push(item);
      this.filteredTechnologies.splice(this.allTechnologies.indexOf(item), 1);
      this.contractorForm.get('technologies')?.setValue('');
      this.isTechnologyAvailable = false;
      // Clear searchbar
      if (this.technologySearchbar) {
        this.technologySearchbar.value = '';
      }
    }
  }

  onTechnologySelectedRemoved(item: any) {
    this.selectedTechnologies.splice(this.selectedTechnologies.indexOf(item), 1);
  }

  getIndustries(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.isIndustryAvailable = true;
      this.filteredIndustries = this.allIndustries.filter((item: any) => {
        return ((item?.industryName).toLowerCase().indexOf(val.toLowerCase()) > -1) &&
          !this.selectedIndustries.find((x: any) => x._id === item._id);
      })
    } else {
      this.isIndustryAvailable = false;
      this.filteredIndustries = [];
    }
  }

  onIndustrySelected(item: any) {
    if (this.selectedIndustries.length === 3) {
      this.industrySelectionErrorMessage = 'Please select maximum 3 industries.';
      return;
    }
    if (!this.selectedIndustries.find((val: any) => val._id === item._id)) {
      this.selectedIndustries.push(item);
      this.contractorForm.get('industries')?.setValue('');
      this.isIndustryAvailable = false;
      this.filteredIndustries = [];
      this.industrySelectionErrorMessage = '';
      // Clear searchbar
      if (this.industrySearchbar) {
        this.industrySearchbar.value = '';
      }
    }
  }

  onIndustrySelectedRemoved(item: any) {
    const index = this.selectedIndustries.findIndex((x: any) => x._id === item._id);
    if (index > -1) {
      this.selectedIndustries.splice(index, 1);
    }
    this.industrySelectionErrorMessage = '';
  }

  getCertifications(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.isCertificationAvailable = true;
      this.filteredCertifications = this.allCerifications.filter((item: any) => {
        return ((item?.certificationName).toLowerCase().indexOf(val.toLowerCase()) > -1) &&
          !this.selectedCertifications.find((x: any) => x._id === item._id);
      })
    } else {
      this.isCertificationAvailable = false;
      this.filteredCertifications = [];
    }
  }

  onCertificationSelected(item: any) {
    if (this.selectedCertifications.length === 3) {
      this.certificationSelectionErrorMessage = 'Please select maximum 3 certifications.';
      return;
    }
    if (!this.selectedCertifications.find((val: any) => val._id === item._id)) {
      this.selectedCertifications.push(item);
      this.contractorForm.get('certifications')?.setValue('');
      this.isCertificationAvailable = false;
      this.filteredCertifications = [];
      this.certificationSelectionErrorMessage = '';
      // Clear searchbar
      if (this.certificationSearchbar) {
        this.certificationSearchbar.value = '';
      }
    }
  }

  onCertificationSelectedRemoved(item: any) {
    const index = this.selectedCertifications.findIndex((x: any) => x._id === item._id);
    if (index > -1) {
      this.selectedCertifications.splice(index, 1);
    }
    this.certificationSelectionErrorMessage = '';
  }

}
