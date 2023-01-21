import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Budget } from 'src/app/common/interfaces/budget';
import {
  faSave,
  faUndo,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FormGroup } from '@angular/forms';
import { FormState } from 'src/app/common/enums/FormState';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseDetailsComponent {
  faSave: IconDefinition = faSave;
  faUndo: IconDefinition = faUndo;

  @Input() form: FormGroup;
  @Input() budgets: Budget[] = [];
  @Input() formState: FormState;

  @Output() saved = new EventEmitter();
  @Output() reseted = new EventEmitter();
}
