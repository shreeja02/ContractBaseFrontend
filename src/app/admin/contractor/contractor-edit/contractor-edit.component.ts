import { ChangeDetectorRef, Component, computed, inject, Inject, model, OnInit, signal } from '@angular/core';
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
  allLocations: any = [{type:'Remote', days: 0},{type:'Inperson', days: 5},{type:'Hybrid', days: 0}];
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
  technologies = signal(['']);
  readonly announcer = inject(LiveAnnouncer);
  selectedTechnologies: any = [];
  threeTechnologiesAreAdded: boolean = false;
  routeSub!: Subscription;
  contractorId: any;
  contractorDetails: any;
  constructor(private fb: FormBuilder,
    private contractorService: ContractorService,
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
        this.getContractorById();
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
          this.handleChangeForProvince(this.contractorDetails.businessProvinceId, true);
          this.handleChangeForPosition(this.contractorDetails.position, true);
          this.selectedTechnologies = this.contractorDetails.technologies;
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
    this.getAllProvinces();
    this.getAllIndustries();
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
        if (res.result.length) {
          this.allProvinces = res.result;
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
        businessNumber: new FormControl(formValues?.businessNumber || '', Validators.required),
        businessAddressLine1: new FormControl(formValues?.businessAddressLine1 || '', Validators.required),
        businessAddressLine2: new FormControl(formValues?.businessAddressLine2),
        businessProvinceId: new FormControl(formValues?.businessProvinceId || '', Validators.required),
        businessCityId: new FormControl(formValues?.businessCityId || '', Validators.required),
        businessZipCode: new FormControl(formValues?.businessZipCode || '', Validators.required),
        linkedInProfile: new FormControl(formValues?.linkedInProfile || '', Validators.required),
        position: new FormControl(formValues?.position || '', Validators.required),
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
    if (selectedValues.length > 0) {
      let find = selectedValues.find((elem: any) => elem.toLowerCase() == 'hybrid');
      if (find) {
        this.hybridSelected = true;
      }
      else {
        this.hybridSelected = false;
        this.hybridDays?.removeValidators(Validators.required);
      }
    }
  }

  onSave() {
    if (this.hybridSelected) {
      var foundIndex = this.allLocations.findIndex((x: any) => x.id == 2);
      this.allLocations[foundIndex].days = this.hybridDays?.value || 0;
    }
    if (!this.isEdit) {
      this.contractorForm.get('userId')?.setValue((this.myControl.value)?._id);
    }
    this.contractorForm.get('technologies')?.setValue(this.selectedTechnologies.map((x: any) => x._id));

    this.loading = true;
    if (this.isEdit) {
      this.contractorService.editContractor(this.contractorForm.value, this.contractorId)
        .pipe(finalize(() => this.loading = false))
        .subscribe((data: any) => {
          if (data.status == 200) {
            this.router.navigate(['/admin/contractor']);
          }
        })
    }
    else {
      this.contractorService.saveContractor(this.contractorForm.value)
        .pipe(finalize(() => this.loading = false))
        .subscribe((data: any) => {
          if (data.status == 200) {
            this.router.navigate(['/admin/contractor']);
          }
        })
    }
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
    this.getTechnologiesByPosition(position);
    this.getCertificationByPosition(position);
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
    }
  }

  onTechnologySelectedRemoved(item: any) {
    this.selectedTechnologies.splice(this.selectedTechnologies.indexOf(item), 1);
  }


}

