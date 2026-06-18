import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly routerLink = inject(Router);

  loginSubscribe: Subscription = new Subscription();
  isLoading: boolean = false;
  mssError: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/),
    ]),
  });
  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginSubscribe.unsubscribe();
      this.loginSubscribe = this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          localStorage.setItem('token', res.data.token);
          this.userService.setCurrentUser(res.data.user);
          this.routerLink.navigate(['/feed']);
        },
        error: (err) => {
          this.mssError = err.error?.message ?? 'Login failed';
          this.isLoading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
