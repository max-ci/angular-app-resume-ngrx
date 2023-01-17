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
  @Input() mode: string;

  @Output() saved = new EventEmitter();
  @Output() reseted = new EventEmitter();

  constructor() {}
}
