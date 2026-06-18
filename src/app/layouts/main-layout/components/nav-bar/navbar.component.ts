import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/post.interface';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavBarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly notificationsService = inject(NotificationsService);

  currentUser: User | null = null;
  defaultAvatar = '/assets/user-icon.svg';
  unreadCount = 0;

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    initFlowbite();
    
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.data?.count ?? res.count ?? res.data ?? 0;
      }
    });
  }

  logOut(): void {
    this.authService.signOut();
  }
}
