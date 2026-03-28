import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenCheck = localStorage.getItem('token');

  if (localStorage.getItem('token')) {
    return router.parseUrl('/feed'); // Redirect to the feed page
  } else {
    return true; // Allow access to the route
  }
};
