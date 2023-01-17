import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './stats/stats.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpensesListComponent } from './expenses/expenses-list/expenses-list.component';
import { BudgetsListComponent } from './budgets/budgets-list/budgets-list.component';
import { BudgetDetailsComponent } from './budgets/budget-details/budget-details.component';
import { ExpenseDetailsComponent } from './expenses/expense-details/expense-details.component';
import { LoginComponent } from './auth/login/login.component';
import { NotificationsComponent } from './notifications/notifications/notifications.component';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../environments/environment';

const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StatsComponent,
    BudgetsComponent,
    ExpensesComponent,
    ExpensesListComponent,
    BudgetsListComponent,
    BudgetDetailsComponent,
    ExpenseDetailsComponent,
    LoginComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DialogModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    FontAwesomeModule,
  ],
  providers: [{ provide: DialogRef, useValue: {} }],
  bootstrap: [AppComponent],
})
export class AppModule {}
