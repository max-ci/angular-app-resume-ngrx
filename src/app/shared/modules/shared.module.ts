import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from 'src/app/stats/stats.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from 'src/app/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpensesListComponent } from 'src/app/expenses/expenses-list/expenses-list.component';
import { ExpensesComponent } from 'src/app/expenses/expenses.component';
import { ExpenseDetailsComponent } from 'src/app/expenses/expense-details/expense-details.component';
import { DialogModule, DialogRef } from '@angular/cdk/dialog';

@NgModule({
  declarations: [
    HomeComponent,
    StatsComponent,
    ExpensesComponent,
    ExpensesListComponent,
    ExpenseDetailsComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, DialogModule],
  exports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  providers: [{ provide: DialogRef, useValue: {} }],
})
export class SharedModule {}
