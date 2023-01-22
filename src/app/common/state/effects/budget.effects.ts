import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { BudgetsService } from '../../services/budgets.service';

@Injectable()
export class BudgetEffects {
  budgets$ = createEffect(() =>
    this.budgetsService.getAll().pipe(
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
    )
  );

  constructor(private budgetsService: BudgetsService) {}
}
