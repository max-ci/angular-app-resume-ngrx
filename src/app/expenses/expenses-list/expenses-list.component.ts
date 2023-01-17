import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Budget } from 'src/app/common/interfaces/budget';
import { Expense } from 'src/app/common/interfaces/expense';
import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesListComponent {
  faTrash: IconDefinition = faTrash;

  @Input() budgets: Budget[] = [];
  @Input() currentExpense: Expense;
  @Input() mode: string = '';

  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();

  budgetTrackBy(index: number, budget: Budget) {
    return budget.id;
  }

  expenseTrackBy(index: number, expense: Expense) {
    return expense.id;
  }
}
