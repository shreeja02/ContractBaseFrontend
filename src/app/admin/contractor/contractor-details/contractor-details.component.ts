import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContractorData } from 'src/app/shared/data/contractor-data';
import { ContractorService } from 'src/app/shared/services/contractor.service';

@Component({
  selector: 'app-contractor-details',
  templateUrl: './contractor-details.component.html',
  styleUrls: ['./contractor-details.component.scss'],
})
export class ContractorDetailsComponent implements OnInit {

  contractorDetails: any;
  contractorId: any;
  routeSub!: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private contractorService:ContractorService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.contractorId = params['id'];
      if(this.contractorId){
        this.getContractorDetails();
      }
    });
  }

  getContractorDetails(){
    this.contractorService.getContractorById(this.contractorId).subscribe(
      (data:any)=>{
        this.contractorDetails = data.result;
      }
    );
  }

  onBackClicked() {
    this.router.navigate(['/admin/contractor']);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
