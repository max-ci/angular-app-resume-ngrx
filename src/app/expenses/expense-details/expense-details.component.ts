import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Budget } from 'src/app/shared/interfaces/budget.interface';
import {
  faSave,
  faUndo,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';
import { FormState } from 'src/app/shared/enums/form-state.enum';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseDetailsComponent {
  faSave: IconDefinition = faSave;
  faUndo: IconDefinition = faUndo;

  @Input() form: FormGroup | undefined;
  @Input() budgets: Budget[] | null | undefined;
  @Input() formState: FormState | undefined;

  @Output() saved = new EventEmitter();
  @Output() reseted = new EventEmitter();
}
