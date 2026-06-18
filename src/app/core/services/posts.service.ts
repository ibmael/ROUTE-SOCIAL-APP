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
    return this.httpClient.get(`${environment.BASE_URL}/posts`);
  }

  createPostRequest(postData: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts`, postData);
  }

  getSinglePostById(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/posts/${postId}`);
  }

  updatePost(postId: string, postData: object): Observable<any> {
    return this.httpClient.put(`${environment.BASE_URL}/posts/${postId}`, postData);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BASE_URL}/posts/${postId}`);
  }

  toggleLike(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.BASE_URL}/posts/${postId}/like`, {});
  }

  getPostLikes(postId: string, page = 1, limit = 20): Observable<any> {
    return this.httpClient.get(
      `${environment.BASE_URL}/posts/${postId}/likes?page=${page}&limit=${limit}`,
    );
  }

  toggleBookmark(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.BASE_URL}/posts/${postId}/bookmark`, {});
  }

  sharePost(postId: string): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts/${postId}/share`, {});
  }
}
