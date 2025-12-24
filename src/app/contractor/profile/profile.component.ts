import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ContractorService } from 'src/app/shared/services/contractor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;
  currentPage = '';
  showProgressSection = true;
  pages = [
    { name: 'basic', selected: false },
    { name: 'business', selected: false },
    { name: 'industry', selected: false },
    { name: 'location', selected: false },
    { name: 'professional', selected: false }];
  currentIndex: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private contractorService: ContractorService
  ) { }

  ngOnInit() {
    this.getCurrentPage();

    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
      this.getContractor();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.getCurrentPage();
    });
  }

  getContractor() {
    if (!this.user) return;
    this.contractorService.getContractor(this.user.id)
      .subscribe((contractor: any) => {
        if (contractor.success) {
          this.contractorService.setContractor(contractor.result);
        }
      })
  }

  getCurrentPage() {
    this.currentPage = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    // Hide progress section when viewing profile
    this.showProgressSection = this.currentPage !== 'view';
    this.currentIndex = this.pages.findIndex(x => x.name == this.currentPage);
    if (this.currentIndex >= 0) {
      this.pages[this.currentIndex].selected = true;
    }
  }

  logout() {
    this.authService.logout();
  }

}
