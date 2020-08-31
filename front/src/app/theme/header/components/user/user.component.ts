import { Component, EventEmitter, Input, Output } from '@angular/core';

import { routes } from '../../../../consts';
import { User } from '@data/models/user.interface';
import { SettingsService, TokenService } from '@core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user: User;
  @Output() signOut: EventEmitter<void> = new EventEmitter<void>();
  public routes: typeof routes = routes;
  public flatlogicEmail = 'https://flatlogic.com';

  constructor(private settings: SettingsService, private token: TokenService, private router: Router) {
  }

  public signOutEmit(): void {
    this.settings.removeCourses();
    this.settings.removeUser();
    this.token.clear();
    this.router.navigate(['/auth/login']);
  }
}
