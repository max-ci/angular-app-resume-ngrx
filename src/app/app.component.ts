import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<User | null> = this._auth.authState;

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
    private _authService: AuthService,
    private _router: Router,
    private _auth: AngularFireAuth
  ) {}

  ngOnInit() {
    this._router.navigate(['/home']);
  }

  logout(): void {
    this._authService.logout();
  }
}
