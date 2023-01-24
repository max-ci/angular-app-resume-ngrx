import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { Budget } from '../common/interfaces/budget.interface';
import { BudgetsService } from '../common/services/budgets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly expenses$: Observable<Budget[]>;
  readonly search: FormControl = new FormControl('');
  readonly searchLoading$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private search$: Subscription;

  constructor(private _budgetsService: BudgetsService) {
    this.expenses$ = this._budgetsService.expenses$.pipe(
      tap(() => {
        this.searchLoading$.next(false);
      })
    );
  }

  ngOnInit() {
    this.search$ = this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchString) => {
          this.searchLoading$.next(true);
          this._budgetsService.setSearchString(searchString);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._budgetsService.setSearchString('');
    this.search$.unsubscribe();
  }
}
