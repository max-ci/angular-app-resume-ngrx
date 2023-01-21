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
import { Budget } from '../common/interfaces/budget';
import { BudgetsService } from '../common/services/budgets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public readonly expenses$: Observable<Budget[]>;
  public readonly search: FormControl = new FormControl('');
  public readonly searchLoading$: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  private search$: Subscription;

  constructor(private budgetsService: BudgetsService) {
    this.expenses$ = this.budgetsService.expenses$.pipe(
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
          this.budgetsService.setSearchString(searchString);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.budgetsService.setSearchString('');
    this.search$.unsubscribe();
  }
}
