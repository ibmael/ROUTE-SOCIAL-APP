import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../core/services/notifications.service';

interface NotificationItem {
  _id: string;
  type: string;
  message?: string;
  createdAt: string;
  isRead: boolean;
  sender?: { name: string; photo: string };
}

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  notifications: NotificationItem[] = [];
  unreadCount = 0;
  isLoading = true;
  filter: 'all' | 'unread' = 'all';

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadUnreadCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.data?.count ?? res.data ?? 0;
      },
    });
  }

  loadNotifications(): void {
    this.isLoading = true;
    const query =
      this.filter === 'unread'
        ? { unread: true, page: 1, limit: 10 }
        : { unread: false, page: 1, limit: 10 };

    this.notificationsService.getNotifications(query).subscribe({
      next: (res) => {
        this.notifications = res.data?.notifications ?? res.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: 'all' | 'unread'): void {
    this.filter = filter;
    this.loadNotifications();
  }

  markAsRead(id: string): void {
    this.notificationsService.markAsRead(id).subscribe({
      next: () => {
        const notification = this.notifications.find((n) => n._id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      },
    });
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        this.unreadCount = 0;
      },
    });
  }
}
