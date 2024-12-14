import { Component, OnInit } from '@angular/core';
import { IndustryInfoComponent } from '../industry-info/industry-info.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { Router } from '@angular/router';
import { PositionService } from 'src/app/shared/services/position.service';
import { TechnologyService } from 'src/app/shared/services/technology.service';
import { CertificationService } from 'src/app/shared/services/certification.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractorService } from 'src/app/shared/services/contractor.service';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss'],
})
export class LocationInfoComponent implements OnInit {

  allPositions: any[] = [];
  allTechnologies: any[] = [];
  allCerifications: any[] = [];

  form = this.createFormGroup();
  isTechnologyAvailable: boolean = false;
  filteredTechnologies: any[] = [];
  selectedTechnologies: any[] = [];
  certificationSelectionErrorMessage: string = "";
  currentContractor: any;

  constructor(
    private router: Router,
    private contractorService: ContractorService,
    private positionService: PositionService,
    private technologyService: TechnologyService,
    private certificationService: CertificationService
  ) { }

  ngOnInit() {
    this.getPositions();
    this.contractorService.currentContractor$.subscribe((contractor: any) => {
      console.log('contractor: ', contractor);
      if (contractor) {
        this.currentContractor = contractor;
        this.form = this.createFormGroup(contractor);
        this.changeTechnology();
      }
    })
  }

  createFormGroup(dataItem: any = {}) {
    dataItem = dataItem ? dataItem : {};
    let form = new FormGroup({
      position: new FormControl(dataItem.position),
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
    this.certificationService.getCertificationByPosition(id).subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allCerifications = res.result;
        }
      }
    );
  }


  previous() {
    this.router.navigateByUrl('contractor/profile/industry');
  }

  next() {
    if (!this.form.valid) return;
    this.contractorService.editContractor({
      ...this.currentContractor,
      ...this.form.value,
      technologies: this.selectedTechnologies.map((x: any) => x._id)
    }, this.currentContractor._id)
      .subscribe((data) => {
        if (data && data.success) {
          this.router.navigateByUrl('contractor/profile/professional');
        }
      });
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
    }
  }

  onTechnologySelectedRemoved(item: any) {
    this.selectedTechnologies.splice(this.selectedTechnologies.indexOf(item), 1);
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
