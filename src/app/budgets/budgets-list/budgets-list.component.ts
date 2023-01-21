import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Budget } from 'src/app/common/interfaces/budget';
import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-budgets-list',
  templateUrl: './budgets-list.component.html',
  styleUrls: ['./budgets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsListComponent {
  faTrash: IconDefinition = faTrash;

  @Input() budgets: Budget[];
  @Input() currentId: string;

  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();

  budgetTrackBy(index: number, budget: Budget) {
    return budget.id;
  }
}
