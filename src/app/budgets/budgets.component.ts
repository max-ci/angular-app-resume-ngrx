import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Budget } from '../common/interfaces/budget.interface';
import { BudgetsService } from '../common/services/budgets.service';
import { NotificationService } from '../common/services/notification.service';
import {
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
import { Store } from '@ngrx/store';
import { selectAllBudgets } from '../common/state/reducers/budget.reducer';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsComponent implements OnInit, OnDestroy {
  readonly budgets$: Observable<Budget[]> =
    this._store.select(selectAllBudgets);
  private readonly _unsubscribeSub$: Subject<void>;

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  private readonly _emptyBudget: Budget = {
    id: '',
    name: '',
    color: '#333333',
    value: 0,
  };
  currentId: string = this._emptyBudget.id;

  form: FormGroup = this._formBuilder.group({
    id: [this._emptyBudget.id],
    name: [this._emptyBudget.name, Validators.required],
    color: [this._emptyBudget.color, Validators.required],
    value: [
      this._emptyBudget.value,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ],
    ],
  });

  formState: FormState = FormState.Create;

  constructor(
    private _store: Store<{ budgets: Budget[] }>,
    private _budgetsService: BudgetsService,
    private _notificationService: NotificationService,
    private _formBuilder: FormBuilder,
    private _dialog: Dialog,
    public dialogRef: DialogRef<boolean>
  ) {
    this._unsubscribeSub$ = new Subject<void>();
  }

  ngOnInit(): void {}

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
    this._budgetsService
      .create(budget)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Budget "${budget.name}" added.`);
        this.reset();
      });
  }

  update(budget: Budget): void {
    this._budgetsService
      .update(budget)
      .pipe(
        takeUntil(this._unsubscribeSub$),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Budget "${budget.name}" updated.`);
        this.reset();
      });
  }

  delete({ id, name }: { id: string; name: string }): void {
    this.dialogRef = this._dialog.open(this.dialogTemplate, {
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

          return this._budgetsService.delete(id);
        }),
        catchError((error) => {
          this.showGeneralError(error);
          return of('error');
        })
      )
      .subscribe(() => {
        this._notificationService.show(`Budget "${name}" deleted.`);
        if (this.currentId === id) {
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
    this.setCurrentId(this._emptyBudget);
    this.form.reset(this._emptyBudget);
    this.setFormState(FormState.Create);
  }

  setFormState(formState: FormState): void {
    this.formState = formState;
  }

  showGeneralError(error: unknown): void {
    this._notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
