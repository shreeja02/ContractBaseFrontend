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
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    const userData = this.extractUserData(this.getToken() || '');
    this.initUser(userData);
  }

  public get currentUser$() {
    return this.currentUser.asObservable();
  }

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Set the JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Check if token exists and is valid
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      // Check if token is expired
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  public get tokenData() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decodedString = jwtDecode(token);
      if (decodedString) {
        return decodedString;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  }

  initUser(data = this.tokenData) {
    if (data) {
      this.currentUser.next(data);
    } else {
      this.currentUser.next(null);
    }
  }

  login(req: any): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'users/login', req)
      .pipe(map((data: any) => {
        if (data && data.success) {
          this.setToken(data.result);
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
      const decodedString = jwtDecode(token);
      return decodedString;
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
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }
}
