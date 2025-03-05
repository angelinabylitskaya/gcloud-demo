import { GoogleService } from '@/core/services';
import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly googleService = inject<GoogleService>(GoogleService);

  userData = this.googleService.getProfile();
}
