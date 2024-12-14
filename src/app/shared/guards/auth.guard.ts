import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(map((auth: any | null) => {
      if (auth && auth !== null) {
        if ((auth.role?.roleName + '').toLowerCase() == 'contractor') {
          this.router.navigateByUrl('/contractor/profile');
        }
        else if ((auth.role?.roleName + '').toLowerCase() == 'admin') {
          this.router.navigateByUrl('/admin/contractor');
        }
        return false;
      }
      return true;
    }));
  }

}
