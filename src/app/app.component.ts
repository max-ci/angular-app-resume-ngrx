import { ChangeDetectionStrategy, Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Link } from './common/interfaces/link';
import { AuthService } from './common/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isLoggedIn$: Observable<User | null> = this.auth.authState;

  links: Link[] = [
    {
      path: 'home',
      title: 'Home',
    },
    {
      path: 'budgets',
      title: 'Budgets',
    },
    {
      path: 'expenses',
      title: 'Expenses',
    },
    {
      path: 'stats',
      title: 'Stats',
    },
  ];

  constructor(
    private authService: AuthService,
    public router: Router,
    private auth: AngularFireAuth
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
