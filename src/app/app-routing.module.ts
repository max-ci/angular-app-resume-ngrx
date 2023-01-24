import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} | Budget Tracker`);
    }
  }
}

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const redirectNotLoggedInToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
    component: LoginComponent,
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    title: 'Home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToLogin },
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'budgets',
    title: 'Budgets',
    component: BudgetsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToLogin },
    loadChildren: () =>
      import('./budgets/budgets.module').then((m) => m.BudgetsModule),
  },
  {
    path: 'expenses',
    title: 'Expenses',
    component: ExpensesComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToLogin },
    loadChildren: () =>
      import('./expenses/expenses.module').then((m) => m.ExpensesModule),
  },

  {
    path: 'stats',
    title: 'Stats',
    component: StatsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectNotLoggedInToLogin },
    loadChildren: () =>
      import('./stats/stats.module').then((m) => m.StatsModule),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule {}
