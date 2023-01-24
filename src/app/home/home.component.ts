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
import { Budget } from '../shared/interfaces/budget.interface';
import { BudgetsService } from '../shared/services/budgets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  expenses$: Observable<Budget[]> | undefined;
  readonly search: FormControl = new FormControl('');
  readonly searchLoading$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  private _search$: Subscription | undefined;

  constructor(private _budgetsService: BudgetsService) {}

  ngOnInit() {
    this.expenses$ = this._budgetsService.expenses$.pipe(
      tap(() => {
        this.searchLoading$.next(false);
      })
    );

    this._search$ = this.search.valueChanges
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
    if (this._search$) {
      this._search$.unsubscribe();
    }
  }
}
