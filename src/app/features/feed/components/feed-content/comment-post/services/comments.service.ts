import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);
  getComments(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/posts/${postId}/comments?page=1&limit=10`);
  }
  creatComments(postId: string, data: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts/${postId}/comments`, data);
  }
}
