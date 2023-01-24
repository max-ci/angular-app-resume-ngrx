import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { budgetsReducer } from './shared/state/reducers/budget.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BudgetEffects } from './shared/state/effects/budget.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BudgetsModule } from './budgets/budgets.module';
import { SharedModule } from './shared/modules/shared.module';
import { HomeModule } from './home/home.module';
import { ExpensesModule } from './expenses/expenses.module';
import { StatsModule } from './stats/stats.module';
import { LoginModule } from './auth/login/login.module';
import { NotificationsComponent } from './notifications/notifications.component';

const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
};

@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    HomeModule,
    BudgetsModule,
    ExpensesModule,
    StatsModule,
    SharedModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: true,
      traceLimit: 25,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
