import { Component, OnInit, ViewChild } from '@angular/core';
import { IndustryInfoComponent } from '../industry-info/industry-info.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { Router } from '@angular/router';
import { PositionService } from 'src/app/shared/services/position.service';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoadingController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss'],
})
export class LocationInfoComponent implements OnInit {
  @ViewChild('technologySearchbar') technologySearchbar!: IonSearchbar;
  @ViewChild('certificationSearchbar') certificationSearchbar!: IonSearchbar;

  allPositions: any[] = [];
  allTechnologies: any[] = [];
  allCerifications: any[] = [];

  form = this.createFormGroup();
  isTechnologyAvailable: boolean = false;
  filteredTechnologies: any[] = [];
  selectedTechnologies: any[] = [];
  isCertificationAvailable: boolean = false;
  filteredCertifications: any[] = [];
  selectedCertifications: any[] = [];
  certificationSelectionErrorMessage: string = "";
  isLoading = false;
  currentContractor: any;
  currentUser: any;

  constructor(
    private router: Router,
    private contractorService: ContractorService,
    private positionService: PositionService,
    private technologyService: TechnologyService,
    private certificationService: CertificationService,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getPositions();
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.getContractorByUserId(this.currentUser.id);
        this.changeTechnology();
      }
      // this.form = this.createFormGroup(this.currentUser);
    })
  }

  getContractorByUserId(contractorId: any) {
    this.contractorService.getContractorByUserId(contractorId).subscribe(
      (data: any) => {
        if (data && data.success) {
          this.currentContractor = data.result;
          this.form = this.createFormGroup(this.currentContractor);
        }
      }
    );
  }

  createFormGroup(dataItem: any = {}) {
    dataItem = dataItem ? dataItem : {};
    let form = new FormGroup({
      position: new FormControl(dataItem.position, Validators.required),
      technologies: new FormControl(dataItem.technologies),
      certifications: new FormControl(dataItem.certifications)
    });
    form.get('position')?.valueChanges.subscribe((data: any) => {
      this.changeTechnology();
    });
    return form;
  }

  changeTechnology() {
    var position = this.form.get('position')?.value;
    if (position) {
      this.getTechnologiesByPosition(position);
      this.getCertificationByPosition(position);
    }
  }

  getPositions() {
    this.positionService.getAllActivePositions().subscribe((data: any) => {
      if (data && data.success) {
        this.allPositions = data.result;

      }
    })
  }

  getTechnologiesByPosition(id: any) {
    this.selectedTechnologies = [];
    this.technologyService.getTechnologiesByPositionId(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allTechnologies = res.result;
          if (this.form.value.technologies) {
            this.allTechnologies.forEach(element => {
              let find = this.form.value.technologies.find((x: any) => x == element._id);
              if (find) {
                this.selectedTechnologies.push(element);
              }
            });
          }
        }
      }
    );
  }

  getCertificationByPosition(id: any) {
    this.selectedCertifications = [];
    this.certificationService.getCertificationByPosition(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCerifications = res.result;
          if (this.form.value.certifications) {
            this.allCerifications.forEach(element => {
              let find = this.form.value.certifications.find((x: any) => x == element._id);
              if (find) {
                this.selectedCertifications.push(element);
              }
            });
          }
        }
      }
    );
  }


  previous() {
    this.router.navigateByUrl('contractor/profile/industry');
  }

  async next() {
    this.form.markAllAsTouched();
    // Validate position is selected
    if (!this.form.valid) {
      return;
    }
    // Validate exactly 3 technologies are selected
    if (this.selectedTechnologies.length !== 3) {
      return;
    }
    // Validate exactly 3 certifications are selected
    if (this.selectedCertifications.length !== 3) {
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Saving position and skills...',
      spinner: 'circular'
    });
    await loading.present();

    this.contractorService.editContractor({
      ...this.currentContractor,
      ...this.form.value,
      technologies: this.selectedTechnologies.map((x: any) => x._id),
      certifications: this.selectedCertifications.map((x: any) => x._id)
    }, this.currentUser.id)
      .subscribe(
        (data) => {
          this.isLoading = false;
          loading.dismiss();
          if (data && data.success) {
            this.router.navigateByUrl('contractor/profile/professional');
          }
        },
        (error) => {
          this.isLoading = false;
          loading.dismiss();
        }
      );
  }

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
    if (!this.selectedTechnologies.filter((val: any) => (val?.technologyName).toLowerCase() == (item?.technologyName).toLowerCase()).length) {
      this.selectedTechnologies.push(item);

      this.filteredTechnologies.splice(this.allTechnologies.indexOf(item), 1);
      this.form.get('technologies')?.setValue('');
      this.isTechnologyAvailable = false;
      if (this.technologySearchbar) {
        this.technologySearchbar.value = '';
      }
    }
  }

  onTechnologySelectedRemoved(item: any) {
    this.selectedTechnologies.splice(this.selectedTechnologies.indexOf(item), 1);
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
    if (this.selectedCertifications.length >= 3) {
      this.certificationSelectionErrorMessage = 'Please select maximum 3 certifications.';
      return;
    }
    if (!this.selectedCertifications.find((val: any) => val._id === item._id)) {
      this.selectedCertifications.push(item);
      this.form.get('certifications')?.setValue('');
      this.isCertificationAvailable = false;
      this.filteredCertifications = [];
      this.certificationSelectionErrorMessage = '';
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
  }

}
