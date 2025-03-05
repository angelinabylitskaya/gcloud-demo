import { CanActivateFn, Router } from '@angular/router';
import { GoogleService } from '../services';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const googleService = inject(GoogleService);
  const router = inject(Router);

  if (googleService.isAuthenticated) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
