import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { map, Observable } from 'rxjs';
import { Stat } from '../common/interfaces/stat';
import { Budget } from '../common/interfaces/budget';
import { Expense } from '../common/interfaces/expense';
import { BudgetsService } from '../common/services/budgets.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent implements OnInit {
  readonly expenses$: Observable<Budget[]>;
  stats$: Observable<Stat[]>;

  @Input() mode: string = '';

  constructor(private _budgetsService: BudgetsService) {
    this.expenses$ = this._budgetsService.expenses$;
  }

  ngOnInit(): void {
    this.getStats();
  }

  getStats(): void {
    this.stats$ = this.expenses$.pipe(
      map((data) => {
        if (!data) {
          return [];
        }

        const budgets = data;

        const stats = budgets.map((budget: Budget) => {
          const expensesValue = budget.expenses.reduce(
            (previousValue: number, currentValue: Expense) =>
              previousValue + currentValue.price * currentValue.amount,
            0
          );
          const ratio =
            budget.value === 0 ? 0 : (expensesValue / budget.value) * 100;

          return {
            budgetName: budget.name,
            budgetValue: budget.value,
            budgetColor: budget.color,
            expensesValue: expensesValue,
            ratio: ratio,
            isTotal: false,
          };
        });

        if (!stats.length) {
          return [];
        }

        const totalBudet = this.getTotalStats(budgets);
        const allStats = [totalBudet, ...stats];
        return allStats;
      })
    );
  }

  getTotalStats(budgets: Budget[]) {
    const totalBudgetsValue = budgets.reduce(
      (previousValue: number, budget: Budget) => {
        return previousValue + budget.value;
      },
      0
    );

    const totalExpensesValue = budgets.reduce(
      (previousValue: number, budget: Budget) => {
        return (
          previousValue +
          budget.expenses.reduce(
            (previousValue: number, expense: Expense) =>
              previousValue + expense.price * expense.amount,
            0
          )
        );
      },
      0
    );

    const totalRadio =
      totalBudgetsValue === 0
        ? 0
        : (totalExpensesValue / totalBudgetsValue) * 100;

    return {
      budgetName: 'Total',
      budgetValue: totalBudgetsValue,
      budgetColor: '#adb5bd',
      expensesValue: totalExpensesValue,
      ratio: totalRadio,
      isTotal: true,
    };
  }
}
