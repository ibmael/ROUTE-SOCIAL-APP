import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';

export const routes: Routes = [
  // redirect only (no component here)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // AUTH PAGES
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'forget',
        loadComponent: () =>
          import('./features/forget-password/forget-password.component').then(
            (m) => m.ForgetPasswordComponent,
          ),
      },
    ],
  },

  // MAIN APP PAGES
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./features/feed/feed.component').then((m) => m.FeedComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notification/notification.component').then(
            (m) => m.NotificationComponent,
          ),
      },
      {
        path: 'change',
        loadComponent: () =>
          import('./features/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./features/detailes/detailes.component').then((m) => m.DetailesComponent),
      },
    ],
  },

  // NOT FOUND
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
