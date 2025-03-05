import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { GoogleService } from '@/core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly googleService = inject<GoogleService>(GoogleService);

  login() {
    this.googleService.loginWithGoogle();
  }
}
