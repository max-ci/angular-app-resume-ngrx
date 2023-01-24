import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  catchError,
  EMPTY,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Budget } from '../common/interfaces/budget';
import { Expense } from '../common/interfaces/expense';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from '../common/services/notification.service';
import { FormState } from '../common/enums/FormState';
import { BudgetsService } from '../common/services/budgets.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent implements OnDestroy {
  readonly budgets$: Observable<Budget[]>;
  private readonly _unsubscribeSub$: Subject<void>;

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  private readonly emptyExpense: Expense = {
    id: '',
    budgetId: '',
    name: '',
    amount: 0,
    price: 0,
  };

  currentId: string = this.emptyExpense.id;
  formState: FormState = FormState.Create;

  form: FormGroup = this.formBuilder.group({
    id: [this.emptyExpense.id],
    name: [this.emptyExpense.name, Validators.required],
    price: [
      this.emptyExpense.price,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
    amount: [
      this.emptyExpense.amount,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
    budgetId: [this.emptyExpense.budgetId, Validators.required],
  });

  constructor(
    private budgetsService: BudgetsService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private dialog: Dialog,
    public dialogRef: DialogRef<boolean>
  ) {
    this.budgets$ = this.budgetsService.expenses$;
    this._unsubscribeSub$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this._unsubscribeSub$.next();
    this._unsubscribeSub$.complete();
  }

  setCurrentId({ expense }: { expense: Expense }): void {
    if (expense.id === '') {
      this.currentId = expense.id;
      return;
    }

    if (this.currentId === expense.id) {
      this.reset();
      return;
    }

    this.currentId = expense.id;
    this.form.patchValue({ ...expense });
    this.setFormState(FormState.Save);
  }

  save(): void {
    const expense = this.form.value;

    if (expense.id) {
      this.update(expense);
    } else {
      this.create(expense);
    }
  }

  create(expense: Expense): void {
    this.budgetsService
      .createExpense(expense)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Expense "${expense.name}" added.`);
        this.reset();
      });
  }

  update(expense: Expense): void {
    this.budgetsService
      .updateExpense(expense)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Expense "${expense.name}" updated.`);
        this.reset();
      });
  }

  delete({
    expenseId,
    expenseName,
  }: {
    expenseId: string;
    expenseName: string;
  }): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      data: {
        text: `Are you sure you want to delete ${expenseName} expense?`,
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

          return this.budgetsService.deleteExpense(expenseId);
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this.notificationService.show(`Expense "${expenseName}" deleted.`);
        if (this.currentId === expenseId) {
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
    this.setCurrentId({ expense: this.emptyExpense });
    this.form.reset(this.emptyExpense);
    this.setFormState(FormState.Create);
  }

  setFormState(formState: FormState): void {
    this.formState = formState;
  }

  showGeneralError(error: unknown) {
    this.notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
