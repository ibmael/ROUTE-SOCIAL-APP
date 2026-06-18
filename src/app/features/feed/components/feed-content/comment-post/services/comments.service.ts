import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getComments(postId: string, page = 1, limit = 10): Observable<any> {
    return this.httpClient.get(
      `${environment.BASE_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
  }

  createComment(postId: string, data: object): Observable<any> {
    return this.httpClient.post(`${environment.BASE_URL}/posts/${postId}/comments`, data);
  }

  updateComment(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.BASE_URL}/posts/${postId}/comments/${commentId}`,
      data,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.BASE_URL}/posts/${postId}/comments/${commentId}`,
    );
  }

  toggleCommentLike(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.BASE_URL}/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }

  getReplies(postId: string, commentId: string, page = 1, limit = 10): Observable<any> {
    return this.httpClient.get(
      `${environment.BASE_URL}/posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
    );
  }

  createReply(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }
}
