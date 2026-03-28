import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  signUp(data: object): Observable<any> {
    const signUpResponse = this.httpClient.post(`${environment.BASE_URL}/users/signup`, data);
    return signUpResponse;
  }
  signIn(data: object): Observable<any> {
    const signInResponse = this.httpClient.post(`${environment.BASE_URL}/users/signin`, data);
    return signInResponse;
  }
}
