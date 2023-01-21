import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  faSave,
  faUndo,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FormState } from 'src/app/common/enums/FormState';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetDetailsComponent {
  faSave: IconDefinition = faSave;
  faUndo: IconDefinition = faUndo;

  @Input() form: FormGroup;
  @Input() formState: FormState;

  @Output() saved = new EventEmitter();
  @Output() reseted = new EventEmitter();

  constructor() {}
}
