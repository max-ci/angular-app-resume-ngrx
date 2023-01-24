import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { BudgetsService } from '../../services/budgets.service';

@Injectable()
export class BudgetEffects {
  budgets$ = createEffect(() =>
    this._authService.userToken$.pipe(
      switchMap((token: string) => {
        if (!token) {
          return EMPTY;
        }

        return this._budgetsService.getAll().pipe(
          mergeMap((actions) => actions),
          map((action) => {
            return {
              type: `[Budgets Data] ${action.type}`,
              payload: {
                id: action.payload.doc.id,
                ...action.payload.doc.data(),
              },
            };
          })
        );
      })
    )
  );

  constructor(
    private _budgetsService: BudgetsService,
    private _authService: AuthService
  ) {}
}
