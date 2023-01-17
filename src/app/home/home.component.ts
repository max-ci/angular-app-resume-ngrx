import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../common/interfaces/budget';
import { ExpensesService } from '../common/services/expenses.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly expenses$: Observable<Budget[]>;

  constructor(private expensesService: ExpensesService) {
    this.expenses$ = this.expensesService.expenses$;
  }
}
