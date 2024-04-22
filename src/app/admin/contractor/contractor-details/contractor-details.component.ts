import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContractorData } from 'src/app/shared/data/contractor-data';

@Component({
  selector: 'app-contractor-details',
  templateUrl: './contractor-details.component.html',
  styleUrls: ['./contractor-details.component.scss'],
})
export class ContractorDetailsComponent implements OnInit {

  contractorData = ContractorData;
  contractorDetails: any;
  contractorId: any;
  routeSub!: Subscription;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.contractorId = params['id'];
    });
    this.contractorDetails = this.contractorData.filter(x => x.contractorId == this.contractorId)[0];
  }

  onBackClicked() {
    this.router.navigate(['/admin/contractor']);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
