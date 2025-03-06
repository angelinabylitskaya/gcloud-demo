import { GoogleService } from '@/core/services';
import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly googleService = inject<GoogleService>(GoogleService);

  readonly logout = this.googleService.logout.bind(this.googleService);

  userData$ = this.googleService.getProfile();
}
