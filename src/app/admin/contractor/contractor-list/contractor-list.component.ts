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
    this.allContractors = this.searchbarControl.valueChanges.subscribe(
      (term) => {
        if (term) {
          this.filteredContractors = this.allContractors.filter((item: any) => {
            return (
              item.businessAddressLine1.toLowerCase().includes(term) ||
              item.businessNumber.includes(term) ||
              item.position.positionName.toLowerCase().includes(term) ||
              item.businessCityId.cityName.toLowerCase().includes(term) ||
              item.industries.some((ind: any) => ind.industryName.toLowerCase().includes(term)) ||
              item.certifications.some((ind: any) => ind.industryName.toLowerCase().includes(term)) ||
              item.location.some((ind: any) => ind.industryName.toLowerCase().includes(term)) ||
              item.technologies.some((ind: any) => ind.industryName.toLowerCase().includes(term)) ||
              (item.userId.firstName.toLowerCase() + ' ' + item.userId.lastName.toLowerCase()).includes(term) ||
              item.yearsOfExperience.toString().includes(term));
          });
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
            this.getAllContractors();
            this.router.navigateByUrl(`/admin/contractor/list`);
            alert("Contractor deleted successfully.");
          }
        }
      );
    }
  }

}
