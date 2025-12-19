import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  contractorDetails: any;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private contractorService: ContractorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.getContractorDetails();
      }
    });
  }

  getContractorDetails() {
    if (!this.currentUser || !this.currentUser.id) return;
    this.contractorService.getContractorById(this.currentUser.id).subscribe(
      (data: any) => {
        if (data.success) {
          this.contractorDetails = data.result;
        }
      }
    );
  }

  onEditProfile() {
    if (this.contractorDetails) {
      // Store contractor data before navigating to edit
      this.contractorService.setContractor(this.contractorDetails);
    }
    this.router.navigateByUrl('contractor/profile/basic');
  }

  onBack() {
    this.router.navigate(['/contractor/dashboard']);
  }

}
