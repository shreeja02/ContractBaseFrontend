import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user: any) => {
      this.user = user;
    })
  }

}
