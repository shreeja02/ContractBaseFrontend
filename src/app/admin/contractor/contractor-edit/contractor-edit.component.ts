import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { PositionService } from 'src/app/shared/services/position.service';
import { ProvinceService } from 'src/app/shared/services/province.service';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-contractor-edit',
  templateUrl: './contractor-edit.component.html',
  styleUrls: ['./contractor-edit.component.scss'],
})
export class ContractorEditComponent implements OnInit {
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
  allLocations: any = [
    { id: 1, location: 'Remote', days: 0 },
    { id: 2, location: 'Hybrid', days: 0 },
    { id: 3, location: 'Inperson', days: 5 },
  ];
  projectBudget: any = [
    { id: 1, budget: '<10MIO' },
    { id: 2, budget: '10MIO - 100MIO' },
    { id: 3, budget: '100MIO - 500MIO' },
    { id: 4, budget: '>500MIO' },
  ];
  teamSize: any = [
    { id: 1, size: '<10' },
    { id: 2, size: '10-50' },
    { id: 3, size: '50-100' },
    { id: 4, size: '>100' },
  ];
  contractLength: any = [
    { id: 1, length: '<6 Months' },
    { id: 2, length: '6 Months - 1 Year' },
    { id: 3, length: '>1 Year' },
  ];
  industrySelectionErrorMessage = '';
  technologySelectionErrorMessage = '';
  certificationSelectionErrorMessage = '';

  allTechnologies: any = [];
  allCerifications: any;
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
    this.filteredContractors = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.firstName + ' ' + value?.lastName;
        return name ? this._filter(name as string) : this.allContractors.slice();
      }),
    );
    this.getAllContractorsFromUser();
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
        businessNumber: new FormControl(formValues?.businessNumber || '', Validators.required),
        businessAddressLine1: new FormControl(formValues?.businessAddressLine1 || '', Validators.required),
        businessAddressLine2: new FormControl(formValues?.businessAddressLine2 || '', Validators.required),
        businessProvinceId: new FormControl(formValues?.businessProvinceId || '', Validators.required),
        businessCityId: new FormControl(formValues?.businessCityId || '', Validators.required),
        businessZipCode: new FormControl(formValues?.businessZipCode || '', [Validators.required, Validators.pattern('^([0-9]{5}|[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9])$')]),
        position: new FormControl(formValues?.position || '', Validators.required),
        location: new FormControl(formValues?.location || [], Validators.required),
        hybridDays: new FormControl(formValues?.hybridDays || 0, Validators.required),
        industries: new FormControl(formValues?.industries || [], Validators.required),
        technologies: new FormControl(formValues?.technologies || [], Validators.required),
        certifications: new FormControl(formValues?.certifications || [], Validators.required),
        yearsOfExperience: new FormControl(formValues?.yearsOfExperience || 0, Validators.required),
        hourlyRate: new FormControl(formValues?.hourlyRate || 0, Validators.required),
        projectBudget: new FormControl(formValues?.projectBudget || [], Validators.required),
        teamSize: new FormControl(formValues?.teamSize || [], Validators.required),
        contractLength: new FormControl(formValues?.contractLength || [], Validators.required),
        availableDate: new FormControl(formValues?.availableDate || [], Validators.required),
        isActive: new FormControl(formValues?.isActive)
      });
  }

  displayFn(user: any): string {
    this.contractorForm.get('userId')?.setValue(user._id);
    return user && user.firstName ? user.firstName + ' ' + user.lastName : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allContractors.filter(option => option.firstName.toLowerCase().includes(filterValue));
  }

  handleChange(event: any) {
    let selectedValues = event.target.value;
    if (selectedValues.length > 0) {
      let find = selectedValues.find((elem: any) => elem.id == 2);
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
}
