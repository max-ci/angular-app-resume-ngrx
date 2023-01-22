import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import { Budget } from 'src/app/common/interfaces/budget';
import {
  BudgetsDataAdded,
  BudgetsDataModified,
  BudgetsDataRemoved,
} from '../actions/budget.actions';

export interface BudgetsState {
  budgets: Budget[];
}

const budgetsInitialState: BudgetsState = {
  budgets: [],
};

function sortByName(budget1: Budget, budget2: Budget): number {
  return budget1.name
    .toLocaleString()
    .localeCompare(budget2.name.toLocaleString());
}

export const budgetsAdapter = createEntityAdapter<Budget>({
  sortComparer: sortByName,
});

export interface State extends EntityState<Budget> {}
export const initialState: State =
  budgetsAdapter.getInitialState(budgetsInitialState);

export const budgetsReducer = createReducer(
  initialState,
  on(BudgetsDataAdded, (state, { payload }) => {
    return budgetsAdapter.addOne(payload, state);
  }),
  on(BudgetsDataModified, (state, { payload }) => {
    return budgetsAdapter.updateOne(
      { id: payload.id, changes: payload },
      state
    );
  }),
  on(BudgetsDataRemoved, (state, { payload }) => {
    return budgetsAdapter.removeOne(payload.id, state);
  })
);

export const getBudgetState = createFeatureSelector<State>('budgets');
export const { selectAll: selectAllBudgets } =
  budgetsAdapter.getSelectors(getBudgetState);
