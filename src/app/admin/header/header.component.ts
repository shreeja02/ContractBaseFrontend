import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) { }
  @ViewChild('popover') popover: any;
  user: any;
  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.currentUser$.subscribe((user) => this.user = user);
  }

  logout() {
    this.popover.dismiss();
    this.authService.logout();
  }

}
