import { Component} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { routes } from '../../../../consts';
import { User } from '@data/models/user.interface';
import { UserService } from '@data/services/user.service';
import { SettingsService } from '@core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public user$: Observable<User>;
  public emails$: Observable<string[]>;
  public routers: typeof routes = routes;
  public firstCourse = null;

  constructor(
    private userService: UserService,
    private router: Router,
    public settings: SettingsService,
  ) {
    this.user$ = this.userService.getUser('');
    this.emails$ = of(['anthony.lardy@gmail.com']);
  }

  public signOut(): void {
    this.router.navigate([this.routers.LOGIN]);
  }
}
