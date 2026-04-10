import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getPosts(): Observable<any> {
    const postsRequest = this.httpClient.get(`${environment.BASE_URL}/posts`);
    return postsRequest;
  }
  createPostRequest(postData: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts`, postData);
  }
  getSinglePostById(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/posts/${postId}`);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BASE_URL}/posts/${postId}`);
  }
}
