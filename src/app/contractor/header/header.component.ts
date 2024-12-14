import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover: any;
  user: any;
  constructor(
    private authService: AuthService
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
  }
}
