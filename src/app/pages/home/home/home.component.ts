import { GoogleService } from '@/core/services';
import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly googleService = inject<GoogleService>(GoogleService);

  readonly logout = this.googleService.logout.bind(this.googleService);

  userData = this.googleService.getProfile();
}
