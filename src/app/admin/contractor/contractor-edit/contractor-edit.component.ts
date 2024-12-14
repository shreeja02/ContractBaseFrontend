import { Component, computed, inject, Inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { finalize, map, Observable, startWith } from 'rxjs';
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
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
  allLocations: any = ['Remote', 'Hybrid', 'Inperson'];
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
  constructor(private fb: FormBuilder,

    private contractorService: ContractorService,
    private userService: UserService,
    private positionService: PositionService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private router: Router,
    private industryService: IndustryService,
    private technologyService: TechnologyService,
    private certificationService: CertificationService) {
    this.contractorForm = this.createForm();
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

  handleChangeForProvince(event: any) {
    this.cityService.getCitiesByProvince(event.detail.value).subscribe(
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
    // this.dialogRef.close({ success: false });
  }

  // onSave() {
  //   if (this.contractorForm.invalid) {
  //     return;
  //   }
  //   if (this.contractorForm?.get('isActive')?.value == null || this.contractorForm?.get('isActive')?.value == undefined) {
  //     this.contractorForm.get('isActive')?.setValue(false);
  //   }
  //   if (this.isEdit) {
  //     this.contractorService.editContractor(this.contractorForm.value, this.data?._id).subscribe(
  //       (res: any) => {
  //         if (res.result) {
  //           this.dialogRef.close({ success: true });
  //         }
  //       },
  //       (err) => {
  //         this.errorMessage = err.errors;
  //       }
  //     );
  //   }
  //   else {
  //     this.contractorService.addNewContractor(this.contractorForm.value).subscribe(
  //       (res: any) => {
  //         if (res.result) {
  //           this.dialogRef.close({ success: true });
  //         }
  //       },
  //       (err) => {
  //         this.errorMessage = err.errors;
  //       }
  //     );
  //   }
  //   this.dialogRef.close({ success: true });
  // }

  createForm(formValues?: any) {
    return this.fb.group(
      {
        userId: new FormControl(formValues?.userId || '', Validators.required),
        linkedInProfile: new FormControl(formValues?.linkedInProfile || '', Validators.required),
        businessNumber: new FormControl(formValues?.businessNumber || '', Validators.required),
        businessAddressLine1: new FormControl(formValues?.businessAddressLine1 || '', Validators.required),
        businessAddressLine2: new FormControl(formValues?.businessAddressLine2 || '', Validators.required),
        businessProvinceId: new FormControl(formValues?.businessProvinceId || '', Validators.required),
        businessCityId: new FormControl(formValues?.businessCityId || '', Validators.required),
        businessZipCode: new FormControl(formValues?.businessZipCode || '', Validators.required),
        position: new FormControl(formValues?.position || '', Validators.required),
        hybridDays: new FormControl(formValues?.hybridDays || 1, Validators.required),
        industries: new FormControl(formValues?.industries || [], Validators.required),
        technologies: new FormControl(formValues?.technologies || [], Validators.required),
        certifications: new FormControl(formValues?.certifications || [], Validators.required),
        location: new FormControl(formValues?.location || [], Validators.required),
        yearsOfExperience: new FormControl(formValues?.yearsOfExperience || 0, Validators.required),
        hourlyRate: new FormControl(formValues?.hourlyRate || 0, Validators.required),
        projectBudget: new FormControl(formValues?.projectBudget || [], Validators.required),
        teamSize: new FormControl(formValues?.teamSize || [], Validators.required),
        contractLength: new FormControl(formValues?.contractLength || [], Validators.required),
        availableDate: new FormControl({ value: formValues?.availableDate || '', disable: true }, Validators.required),
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
        this.contractorForm.get('hybridDays')?.removeValidators(Validators.required);
      }
    }
    console.log('event: ', event.target.value);
  }

  onSave() {
    if (this.hybridSelected) {
      var foundIndex = this.allLocations.findIndex((x: any) => x.id == 2);
      this.allLocations[foundIndex].days = this.contractorForm.get('hybridDays')?.value || 0;
    }
    else {
      this.contractorForm.get('hybridDays')?.removeValidators(Validators.required);
    }
    this.contractorForm.get('userId')?.setValue((this.myControl.value)?._id);
    console.log(this.contractorForm.value);
    console.log('this.selectedTechnologies: ', this.selectedTechnologies);
    this.contractorForm.get('technologies')?.setValue(this.selectedTechnologies.map((x: any) => x._id));

    console.log('this.contractorForm.value: ', this.contractorForm.value);
    this.loading = true;
    this.contractorService.saveContractor(this.contractorForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: any) => {
        if(data.status==200){
          this.router.navigate(['/admin/contractor']);
        }
      })
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

  handleChangeForPosition(event: any) {
    this.getTechnologiesByPosition(event.target.value);
    this.getCertificationByPosition(event.target.value);
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
      console.log('this.selectedTechnologies: ', this.selectedTechnologies);
      this.filteredTechnologies.splice(this.allTechnologies.indexOf(item), 1);
      this.contractorForm.get('technologies')?.setValue('');
      this.isTechnologyAvailable = false;
    }
  }

  onTechnologySelectedRemoved(item: any) {
    this.selectedTechnologies.splice(this.selectedTechnologies.indexOf(item), 1);
  }


}

