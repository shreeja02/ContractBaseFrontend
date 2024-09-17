import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isPasswordHidden = true;
  public loginForm = new FormGroup({
    "email": new FormControl('', Validators.required),
    "password": new FormControl('', Validators.required)
  });
  public loading = false;
  public errorMessage = "";

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    localStorage.clear();
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.errorMessage = "";
            if ((data.roleName + "").toLowerCase() == 'admin') {
              this.router.navigate(['/admin/contractor']);
            }
            else {
              this.router.navigate(['/contractor'])
            }
          }
          else {
            this.errorMessage = "Invalid credentials, email or password is invalid!";
          }
        },
        error: (err: any) => {
          this.errorMessage = "Invalid credentials, email or password is invalid!";
        }
      })
  }
}
