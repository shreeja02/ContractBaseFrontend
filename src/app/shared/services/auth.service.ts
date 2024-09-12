import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // This will be initialized during the first injection of this service (app.component).
    // Purpose behind this call - If the user is logged in and page gets refreshed,
    // it should initiate the user value from the token and the session should be considered as logged in session.
    this.initUser();
  }

  public get currentUser$() {
    return this.currentUser.asObservable();
  }

  public get tokenData() {
    var token = localStorage.getItem('authToken');
    if (!token) return null;
    var decodedString = atob(token.split('.')[1])
    if (decodedString) {
      return JSON.parse(decodedString)?.res;
    }
    return null;
  }

  initUser() {
    if (this.tokenData) {
      this.currentUser.next(this.tokenData);
    }
  }

  login(req: any): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'users/login', req)
      .pipe(map((data: any) => {
        if (data && data.success) {
          localStorage.setItem('authToken', data.result);
          this.initUser();
        }
        return this.tokenData;
      }));
  }

  signup(data: any) {
    return this.http.post(environment.apiEndPoint + 'users/signup', data);
  }

  logout() {
    this.currentUser.next(null);
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
