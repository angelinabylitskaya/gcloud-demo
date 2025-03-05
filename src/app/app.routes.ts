import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'auth-callback',
    loadComponent: () =>
      import('./pages/auth/callback/callback.component').then(
        (m) => m.CallbackComponent,
      ),
  },
];
