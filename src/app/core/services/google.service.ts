import { inject, Injectable } from '@angular/core';
import { environment } from '@/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  private readonly http = inject<HttpClient>(HttpClient);
  private readonly router = inject<Router>(Router);

  private readonly token = new BehaviorSubject<string | null>(
    localStorage.getItem('access_token'),
  );

  get isAuthenticated(): boolean {
    return !!this.token.getValue();
  }

  logout(): void {
    this.token.next(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  loginWithGoogle(): void {
    if (localStorage.getItem('access_token')) {
      this.navigateHome();
      return;
    }

    const url = `${environment.gcloud.authUrl}?response_type=code&client_id=${environment.gcloud.clientId}&redirect_uri=${environment.gcloud.redirectUri}&scope=${environment.gcloud.scope}&access_type=offline&prompt=consent`;
    window.location.href = url;
  }

  completeLogin(code: string): Observable<void> {
    if (this.isAuthenticated) {
      return of(this.navigateHome());
    }
    if (!code) {
      throw throwError(() => new Error('Invalid Code'));
    }
    return this.http
      .post(
        'https://exchange-code-for-token-257658909770.us-central1.run.app',
        { auth_code: code },
      )
      .pipe(
        take(1),
        map((response: any) => {
          this.token.next(response.access_token);
          localStorage.setItem('access_token', response.access_token);
          this.navigateHome();
        }),
        catchError((error) => {
          console.error('Token exchange failed', error);
          throw new Error('Token exchange failed');
        }),
      );
  }

  getProfile(): Observable<any> {
    return this.token.asObservable().pipe(
      switchMap((token) => {
        if (!token) {
          throw new Error();
        }
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`,
        );
        return this.http.get('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers,
        });
      }),
      catchError(() => {
        return of(this.logout());
      }),
    );
  }

  private navigateHome(): void {
    this.router.navigate(['']);
  }
}
