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
import { EMPTY, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetsComponent implements OnDestroy {
  public readonly budgets$: Observable<Budget[]>;
  private readonly _unsubscribeSub$: Subject<void>;

  @ViewChild('dialogTemplate') dialogTemplate: TemplateRef<any>;

  emptyBudget: Budget = {
    id: '',
    name: '',
    color: '#333333',
    value: 0,
  };
  currentBudget: Budget = { ...this.emptyBudget };

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

  mode: string = 'Create';

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

  setCurrent(budget: Budget): void {
    if (budget.id !== '' && this.currentBudget.id === budget.id) {
      this.reset();
      return;
    }

    this.form.patchValue({ ...budget });
    this.currentBudget = { ...budget };
    this.setMode('Save');
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
      .pipe(takeUntil(this._unsubscribeSub$))
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Budget "${budget.name}" added.`);
          this.reset();
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
      });
  }

  update(budget: Budget): void {
    this.budgetsService
      .update(budget)
      .pipe(takeUntil(this._unsubscribeSub$))
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Budget "${budget.name}" updated.`);
          this.reset();
        },
        error: (error): void => {
          this.showGeneralError(error);
        },
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
        })
      )
      .subscribe({
        next: (): void => {
          this.notificationService.show(`Budget "${name}" deleted.`);
          if (this.currentBudget.id === id) {
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

          return this.budgetsService.loadSampleData();
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
    this.setCurrent(this.emptyBudget);
    this.form.reset();
    this.setMode('Create');
  }

  setMode(mode: string): void {
    this.mode = mode;
  }

  showGeneralError(error: unknown): void {
    this.notificationService.show('An error occured', 'danger');
    console.error(error);
  }
}
