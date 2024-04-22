import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractorData } from 'src/app/shared/data/contractor-data';

@Component({
  selector: 'app-contractor-list',
  templateUrl: './contractor-list.component.html',
  styleUrls: ['./contractor-list.component.scss'],
})
export class ContractorListComponent implements OnInit {

  contractorList = ContractorData;
  constructor(private router: Router) { }

  ngOnInit() { }

  onViewMoreClicked(id: number) {
    this.router.navigateByUrl(`/admin/contractor/details/${id}`);
  }

}
