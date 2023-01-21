import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Budget } from '../common/interfaces/budget';
import { BudgetsService } from '../common/services/budgets.service';
import { NotificationService } from '../common/services/notification.service';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormState } from '../common/enums/FormState';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsComponent implements OnDestroy {
  public readonly budgets$: Observable<Budget[]>;
  private readonly _unsubscribeSub$: Subject<void>;
  private readonly currentId$: BehaviorSubject<void>;

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  private readonly emptyBudget: Budget = {
    id: '',
    name: '',
    color: '#333333',
    value: 0,
  };
  public currentId: string = this.emptyBudget.id;

  public form: FormGroup = this.formBuilder.group({
    id: [this.emptyBudget.id],
    name: [this.emptyBudget.name, Validators.required],
    color: [this.emptyBudget.color, Validators.required],
    value: [
      this.emptyBudget.value,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
  });

  public formState: FormState = FormState.Create;

  constructor(
    private budgetsService: BudgetsService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private dialog: Dialog,
    public dialogRef: DialogRef<boolean>
  ) {
    this.budgets$ = this.budgetsService.budgets$;
    this._unsubscribeSub$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this._unsubscribeSub$.next();
    this._unsubscribeSub$.complete();
  }

  setCurrentId(budget: Budget): void {
    if (budget.id === '') {
      this.currentId = budget.id;
      return;
    }

    if (this.currentId === budget.id) {
      this.reset();
      return;
    }

    this.form.patchValue({ ...budget });
    this.currentId = budget.id;
    this.setFormState(FormState.Save);
  }

  save(): void {
    const formValue = this.form.value;

    if (formValue.id) {
      this.update(formValue);
    } else {
      this.create(formValue);
    }
  }

  create(budget: Budget): void {
    this.budgetsService
      .create(budget)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Budget "${budget.name}" added.`);
        this.reset();
      });
  }

  update(budget: Budget): void {
    this.budgetsService
      .update(budget)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Budget "${budget.name}" updated.`);
        this.reset();
      });
  }

  delete({ id, name }: { id: string; name: string }): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      data: {
        text: `Are you sure you want to delete ${name} budget?`,
        buttonText: 'Delete',
      },
    });

    this.dialogRef.closed
      .pipe(
        takeUntil(this._unsubscribeSub$),
        switchMap((result: boolean) => {
          if (!result) {
            return EMPTY;
          }

          return this.budgetsService.delete(id);
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Budget "${name}" deleted.`);
        if (this.currentId === id) {
          this.reset();
        }
      });
  }

  loadSampleData(): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      data: {
        text: `Are you sure you want to load sample data? All your data will be replaced.`,
        buttonText: 'Load sample data',
      },
    });

    this.dialogRef.closed
      .pipe(
        takeUntil(this._unsubscribeSub$),
        switchMap((result: boolean) => {
          if (!result) {
            return EMPTY;
          }

          return this.budgetsService.loadSampleData();
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show('Sample data loaded.');
        this.reset();
      });
  }

  reset(): void {
    this.setCurrentId(this.emptyBudget);
    this.form.reset(this.emptyBudget);
    this.setFormState(FormState.Create);
  }

  setFormState(formState: FormState): void {
    this.formState = formState;
  }

  showGeneralError(error: unknown): void {
    this.notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
