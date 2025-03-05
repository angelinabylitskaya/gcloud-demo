import { CanActivateFn } from '@angular/router';
import { GoogleService } from '../services';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const googleService = inject(GoogleService);

  if (googleService.isAuthenticated) {
    return true;
  }

  return false;
};
