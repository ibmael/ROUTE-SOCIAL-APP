import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationsQuery {
  unread?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);

  getNotifications(query: NotificationsQuery = {}): Observable<any> {
    const { unread, page = 1, limit = 10 } = query;
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (unread !== undefined) {
      params.set('unread', String(unread));
    }
    return this.httpClient.get(`${environment.BASE_URL}/notifications?${params.toString()}`);
  }

  getUnreadCount(): Observable<any> {
    return this.httpClient.get(`${environment.BASE_URL}/notifications/unread-count`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(
      `${environment.BASE_URL}/notifications/${notificationId}/read`,
      {},
    );
  }

  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.BASE_URL}/notifications/read-all`, {});
  }
}
