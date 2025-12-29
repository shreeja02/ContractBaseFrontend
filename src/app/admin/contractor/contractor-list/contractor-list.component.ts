import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractorData } from 'src/app/shared/data/contractor-data';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { ContractorEditComponent } from '../contractor-edit/contractor-edit.component';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-contractor-list',
  templateUrl: './contractor-list.component.html',
  styleUrls: ['./contractor-list.component.scss'],
})
export class ContractorListComponent implements OnInit {
  allContractors: any = [];
  filteredContractors: any = [];
  searchbarControl: FormControl = new FormControl('');
  constructor(private router: Router, private contractorService: ContractorService, public dialog: MatDialog) { }

  ngOnInit() {
    this.search();
    this.getAllContractors();
  }

  search() {
    this.searchbarControl.valueChanges.pipe(
      startWith('')
    ).subscribe(
      (term) => {
        if (term && term.trim()) {
          this.filteredContractors = this.allContractors.filter((item: any) => {
            return (
              item.businessAddressLine1.toLowerCase().includes(term.toLowerCase()) ||
              item.businessNumber.toString().includes(term) ||
              item.position.positionName.toLowerCase().includes(term.toLowerCase()) ||
              item.businessCityId.cityName.toLowerCase().includes(term.toLowerCase()) ||
              item.industries.some((ind: any) => ind.industryName.toLowerCase().includes(term.toLowerCase())) ||
              item.certifications.some((ind: any) => ind.certificationName.toLowerCase().includes(term.toLowerCase())) ||
              item.location.some((ind: any) => ind.type.toLowerCase().includes(term.toLowerCase())) ||
              item.technologies.some((ind: any) => ind.technologyName.toLowerCase().includes(term.toLowerCase())) ||
              (item.userId.firstName.toLowerCase() + ' ' + item.userId.lastName.toLowerCase()).includes(term.toLowerCase()) ||
              item.yearsOfExperience.toString().includes(term));
          });
        } else {
          this.filteredContractors = this.allContractors;
        }
      }
    );
  }

  onViewMoreClicked(id: number) {
    this.router.navigateByUrl(`/admin/contractor/details/${id}`);
  }

  getAllContractors() {
    this.contractorService.getAllContractors().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allContractors = res.result;
          this.filteredContractors = this.allContractors;
        }
      }
    );
  }

  onAddNewContractor() {
    this.router.navigateByUrl(`/admin/contractor/add`);
  }

  onEdit(item: any) {
    this.router.navigateByUrl(`/admin/contractor/edit/contractor/${item._id}`);
  }

  onDelete(item: any) {
    if (confirm("Are you sure to delete " + item.userId.firstName + " " + item.userId.lastName + "?")) {
      this.contractorService.deleteContractor(item._id).subscribe(
        (res: any) => {
          if (res.success) {
            alert("Contractor deleted successfully.");
            this.getAllContractors();
            this.router.navigateByUrl(`/admin/contractor/list`);
          }
        }
      );
    }
  }

}
