import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { ProvinceService } from './shared/services/province.service';
import { CityService } from './shared/services/city.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService, // Injected here to initialize user if exists;,
  ) { }


}
