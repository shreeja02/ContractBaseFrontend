import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    const userData = this.extractUserData(localStorage.getItem('authToken') || '');
    this.initUser(userData);
  }

  public get currentUser$() {
    return this.currentUser.asObservable();
  }

  public get tokenData() {
    var token = localStorage.getItem('authToken');
    if (!token) return null;
    var decodedString =  jwtDecode(token);
    if (decodedString) {
      return decodedString;
    }
    return null;
  }

  initUser(data = this.tokenData) {
    if (data) {
      this.currentUser.next(data);
    }
  }

  login(req: any): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'users/login', req)
      .pipe(map((data: any) => {
        if (data && data.success) {
          localStorage.setItem('authToken', data.result);
          const userData = this.extractUserData(data.result);
          this.currentUser.next(userData);
          return userData;
        }
        return null;
      }));
  }

  private extractUserData(token: string) {
    if (!token) return null;
    try {
      const decodedString = atob(token.split('.')[1]);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
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
