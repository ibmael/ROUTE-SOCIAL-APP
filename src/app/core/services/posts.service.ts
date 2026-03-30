import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  httpOptions: object = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  getPosts(): Observable<any> {
    const postsRequest = this.httpClient.get(`${environment.BASE_URL}/posts`, this.httpOptions);
    return postsRequest;
  }
  createPostRequest(postData: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts`, postData, this.httpOptions);
  }
  getSinglePostById(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/posts/${postId}`, this.httpOptions);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BASE_URL}/posts/${postId}`, this.httpOptions);
  }
}
