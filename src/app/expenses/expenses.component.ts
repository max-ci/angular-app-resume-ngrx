import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Budget } from '../common/interfaces/budget';
import { Expense } from '../common/interfaces/expense';
import { ExpensesService } from '../common/services/expenses.service';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from '../common/services/notification.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent implements OnDestroy {
  public readonly budgets$: Observable<Budget[]>;
  private readonly _unsubscribeSub$: Subject<void>;

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  emptyExpense: Expense = {
    id: '',
    budgetId: '',
    name: '',
    amount: 0,
    price: 0,
  };
  currentExpense: Expense = { ...this.emptyExpense };
  mode: string = 'Create';

  public form: FormGroup = this.formBuilder.group({
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
    private expensesService: ExpensesService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private dialog: Dialog,
    public dialogRef: DialogRef<boolean>
  ) {
    this.budgets$ = this.expensesService.expenses$;
    this._unsubscribeSub$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this._unsubscribeSub$.next();
    this._unsubscribeSub$.complete();
  }

  setCurrent({ expense }: { expense: Expense }): void {
    if (expense.id !== '' && this.currentExpense.id === expense.id) {
      this.reset();
      return;
    }

    this.currentExpense = { ...expense };
    this.form.patchValue({ ...expense });
    this.setMode('Save');
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
    this.expensesService
      .create(expense)
      .pipe(takeUntil(this._unsubscribeSub$))
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Expense "${expense.name}" added.`);
          this.reset();
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
      });
  }

  update(expense: Expense): void {
    this.expensesService
      .update(expense)
      .pipe(takeUntil(this._unsubscribeSub$))
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Expense "${expense.name}" updated.`);
          this.reset();
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
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

          return this.expensesService.delete(expenseId);
        })
      )
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Expense "${expenseName}" deleted.`);
          if (this.currentExpense.id === expenseId) {
            this.reset();
          }
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
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

          return this.expensesService.loadSampleData();
        })
      )
      .subscribe({
        next: (): void => {
          this.notificationService.show('Sample data loaded.');
          this.reset();
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
      });
  }

  reset(): void {
    this.setCurrent({ expense: this.emptyExpense });
    this.form.reset();
    this.form.patchValue(this.emptyExpense);
    this.setMode('Create');
  }

  setMode(mode: string): void {
    this.mode = mode;
  }

  showGeneralError(error: unknown) {
    this.notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
