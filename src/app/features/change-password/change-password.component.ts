import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly usersService = inject(UsersService);
  private readonly toastr = inject(ToastrService);

  isLoading = false;
  errorMessage = '';

  changeForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  submit(): void {
    if (this.changeForm.invalid) {
      this.changeForm.markAllAsTouched();
      return;
    }

    const { password, newPassword, confirmPassword } = this.changeForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.usersService.changePassword({ password: password!, newPassword: newPassword! }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
        }
        this.toastr.success('Password changed successfully');
        this.changeForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Failed to change password';
      },
    });
  }
}
