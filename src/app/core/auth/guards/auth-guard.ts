import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // implement router package
  const router = inject(Router);
  // Check if the user is authenticated (e.g., by checking for a token in localStorage)
  const tokenCheck = localStorage.getItem('token');

  if (tokenCheck) {
    return true; // Allow access to the route
  } else {
    return router.parseUrl('/login'); // Redirect to the login page
  }
};
