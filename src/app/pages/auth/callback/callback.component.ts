import { Component, inject, signal, OnInit } from '@angular/core';
import { GoogleService } from '@/core/services';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  private readonly route = inject<ActivatedRoute>(ActivatedRoute);
  private readonly googleService = inject<GoogleService>(GoogleService);

  error = signal('');

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        take(1),
        switchMap((params) => {
          const code = params['code'];
          return this.googleService.completeLogin(code);
        }),
        catchError((error) => {
          this.error.set(error.message);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
