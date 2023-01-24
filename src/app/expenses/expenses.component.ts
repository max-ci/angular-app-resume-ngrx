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
import { Budget } from '../common/interfaces/budget.interface';
import { Expense } from '../common/interfaces/expense.interface';
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

  private readonly _emptyExpense: Expense = {
    id: '',
    budgetId: '',
    name: '',
    amount: 0,
    price: 0,
  };

  currentId: string = this._emptyExpense.id;
  formState: FormState = FormState.Create;

  form: FormGroup = this._formBuilder.group({
    id: [this._emptyExpense.id],
    name: [this._emptyExpense.name, Validators.required],
    price: [
      this._emptyExpense.price,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
    amount: [
      this._emptyExpense.amount,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
    budgetId: [this._emptyExpense.budgetId, Validators.required],
  });

  constructor(
    private _budgetsService: BudgetsService,
    private _notificationService: NotificationService,
    private _formBuilder: FormBuilder,
    private _dialog: Dialog,
    public dialogRef: DialogRef<boolean>
  ) {
    this.budgets$ = this._budgetsService.expenses$;
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
    this._budgetsService
      .createExpense(expense)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Expense "${expense.name}" added.`);
        this.reset();
      });
  }

  update(expense: Expense): void {
    this._budgetsService
      .updateExpense(expense)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Expense "${expense.name}" updated.`);
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
    this.dialogRef = this._dialog.open(this.dialogTemplate, {
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

          return this._budgetsService.deleteExpense(expenseId);
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Expense "${expenseName}" deleted.`);
        if (this.currentId === expenseId) {
          this.reset();
        }
      });
  }

  loadSampleData(): void {
    this.dialogRef = this._dialog.open(this.dialogTemplate, {
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

          return this._budgetsService.loadSampleData();
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show('Sample data loaded.');
        this.reset();
      });
  }

  reset(): void {
    this.setCurrentId({ expense: this._emptyExpense });
    this.form.reset(this._emptyExpense);
    this.setFormState(FormState.Create);
  }

  setFormState(formState: FormState): void {
    this.formState = formState;
  }

  showGeneralError(error: unknown) {
    this._notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
