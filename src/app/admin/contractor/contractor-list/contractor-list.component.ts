import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractorData } from 'src/app/shared/data/contractor-data';
import { ContractorService } from 'src/app/shared/services/contractor.service';
import { ContractorEditComponent } from '../contractor-edit/contractor-edit.component';

@Component({
  selector: 'app-contractor-list',
  templateUrl: './contractor-list.component.html',
  styleUrls: ['./contractor-list.component.scss'],
})
export class ContractorListComponent implements OnInit {
  allContractors = [];
  contractorList = ContractorData;
  constructor(private router: Router, private contractorService: ContractorService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllContractors();
  }

  onViewMoreClicked(id: number) {
    this.router.navigateByUrl(`/admin/contractor/details/${id}`);
  }
  getAllContractors() {
    this.contractorService.getAllContractors().subscribe(
      (res: any) => {
        if (res.result.length) {
          this.allContractors = res.result;
        }
      }
    );
  }

  onAddNewContractor() {
    this.router.navigateByUrl(`/admin/contractor/add`);
    // const dialogRef = this.dialog.open(ContractorEditComponent, { width: '600px' });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result.success) {
    //     this.getAllContractors();
    //   }
    // });
  }

}
