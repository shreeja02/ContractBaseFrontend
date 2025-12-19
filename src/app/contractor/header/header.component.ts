import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover: any;
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((data: any) => {
      if (data) {
        this.user = data;
      }
    })
  }

  logout() {
    this.popover.dismiss();
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
