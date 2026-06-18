import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  changePassword(data: ChangePasswordPayload): Observable<any> {
    return this.httpClient.patch(`${environment.BASE_URL}/users/change-password`, data);
  }

  uploadPhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.httpClient.put(`${environment.BASE_URL}/users/upload-photo`, formData);
  }

  getProfileData(): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/profile-data`);
  }

  getBookmarks(): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/bookmarks`);
  }

  getSuggestions(limit = 10, page = 1): Observable<any> {
    return this.httpClient.get(
      `${environment.BASE_URL}/users/suggestions?limit=${limit}&page=${page}`,
    );
  }

  getUserProfile(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/${userId}/profile`);
  }

  followUser(userId: string): Observable<any> {
    return this.httpClient.put(`${environment.BASE_URL}/users/${userId}/follow`, {});
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/${userId}/posts`);
  }

  getFollowers(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/${userId}/followers`);
  }

  getFollowing(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/users/${userId}/following`);
  }
}
