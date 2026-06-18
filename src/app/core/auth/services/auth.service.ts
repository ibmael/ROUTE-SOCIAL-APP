import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  signUp(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/users/signup`, data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/users/signin`, data);
  }

  signOut(): void {
    this.userService.clearSession();
    this.router.navigate(['/login']);
  }
}
