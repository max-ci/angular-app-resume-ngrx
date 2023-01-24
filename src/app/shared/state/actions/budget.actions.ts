import { createAction, props } from '@ngrx/store';
import { Budget } from 'src/app/shared/interfaces/budget.interface';

export enum BudgetsActionTypes {
  BUDGETS_DATA_ADDED = '[Budgets Data] added',
  BUDGETS_DATA_MODIFIED = '[Budgets Data] modified',
  BUDGETS_DATA_REMOVED = '[Budgets Data] removed',
}

export const BudgetsDataAdded = createAction(
  BudgetsActionTypes.BUDGETS_DATA_ADDED,
  props<{ payload: Budget }>()
);

export const BudgetsDataModified = createAction(
  BudgetsActionTypes.BUDGETS_DATA_MODIFIED,
  props<{ payload: Budget }>()
);

export const BudgetsDataRemoved = createAction(
  BudgetsActionTypes.BUDGETS_DATA_REMOVED,
  props<{ payload: Budget }>()
);
