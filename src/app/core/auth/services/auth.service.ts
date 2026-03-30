import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data: object): Observable<any> {
    const signUpResponse = this.httpClient.post(`${environment.BASE_URL}/users/signup`, data);
    return signUpResponse;
  }
  signIn(data: object): Observable<any> {
    const signInResponse = this.httpClient.post(`${environment.BASE_URL}/users/signin`, data);
    return signInResponse;
  }
  signOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
