import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClientService } from './http-client.service';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { budgetsData, expensesData } from '../data/budgets.data';
import {
  parseFirestoreObject,
  prepareGetPayload,
} from '../helpers/firestore.helper';
import { Budget } from '../interfaces/budget';
import { Expense } from '../interfaces/expense';

const POST_BASE_URL =
  'https://firestore.googleapis.com/v1/projects/angular-resume-app/databases/(default)/documents';
const DELETE_BASE_URL = 'https://firestore.googleapis.com/v1/';
const BASE_BUDGETS_COLLECTION_PATH =
  'projects/angular-resume-app/databases/(default)/documents/budgets/';
const BASE_EXPENSES_COLLECTION_PATH =
  'projects/angular-resume-app/databases/(default)/documents/expenses/';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly _refreshSub$: BehaviorSubject<void>;
  public readonly expenses$: Observable<Budget[]>;

  constructor(
    private http: HttpClientService,
    private authService: AuthService
  ) {
    this._refreshSub$ = new BehaviorSubject<void>(undefined);

    this.expenses$ = this._refreshSub$.pipe(
      switchMap(() => this.authService.userToken$),
      switchMap((token): Observable<any> => {
        if (!token) {
          return of(null);
        }

        return forkJoin({
          budgets: this.http.post(
            `${POST_BASE_URL}:runQuery`,
            prepareGetPayload('budgets', 'name'),
            token
          ),
          expenses: this.http.post(
            `${POST_BASE_URL}:runQuery`,
            prepareGetPayload('expenses', 'name'),
            token
          ),
        });
      }),
      map((data) => {
        if (!data || !data?.budgets?.[0]?.document) {
          return [];
        }

        return data.budgets.map((budget: any) => {
          const budgetData = parseFirestoreObject(budget.document.fields);
          const expenses = data.expenses
            .filter((expense: any) => {
              const expenseData = parseFirestoreObject(expense.document.fields);
              return expenseData.budgetId === budgetData.id;
            })
            .map((expense: any) => {
              return {
                ...parseFirestoreObject(expense.document.fields),
                id: expense.document.name,
              };
            });
          return {
            ...budgetData,
            expenses,
            id: budget.document.name,
          };
        });
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  create(expense: Expense) {
    return this.authService.userToken$.pipe(
      switchMap((token) => {
        return this.http.post(
          `${POST_BASE_URL}/expenses`,
          {
            fields: {
              id: { stringValue: uuidv4() },
              budgetId: { stringValue: expense.budgetId },
              name: { stringValue: expense.name },
              price: { integerValue: expense.price },
              amount: { integerValue: expense.amount },
            },
          },
          token
        );
      }),
      tap((): void => this._refreshSub$.next())
    );
  }

  update(updatedExpense: Expense) {
    return this.authService.userToken$.pipe(
      switchMap((token) => {
        return this.http.post(
          `${POST_BASE_URL}:commit`,
          {
            writes: [
              {
                update: {
                  name: updatedExpense.id,
                  fields: {
                    id: { stringValue: updatedExpense.id },
                    budgetId: { stringValue: updatedExpense.budgetId },
                    name: { stringValue: updatedExpense.name },
                    price: {
                      integerValue: updatedExpense.price,
                    },
                    amount: {
                      integerValue: updatedExpense.amount,
                    },
                  },
                },
              },
            ],
          },
          token
        );
      }),
      tap((): void => this._refreshSub$.next())
    );
  }

  delete(expenseId: string) {
    return this.authService.userToken$.pipe(
      switchMap((token) => {
        return this.http.delete(`${DELETE_BASE_URL}${expenseId}`, token);
      }),
      tap((): void => this._refreshSub$.next())
    );
  }

  loadSampleData() {
    const budgets = budgetsData.map((budget: Budget, index: number) => {
      return {
        update: {
          name: `${BASE_BUDGETS_COLLECTION_PATH}budget${index}`,
          fields: {
            id: {
              stringValue: `${BASE_BUDGETS_COLLECTION_PATH}budget${index}`,
            },
            name: { stringValue: budget.name },
            color: { stringValue: budget.color },
            value: { integerValue: budget.value },
          },
        },
      };
    });

    const expenses = expensesData.map((expense: Expense, index: number) => {
      return {
        update: {
          name: `${BASE_EXPENSES_COLLECTION_PATH}expense${index}`,
          fields: {
            id: {
              stringValue: `${BASE_EXPENSES_COLLECTION_PATH}expense${index}`,
            },
            budgetId: {
              stringValue: `${BASE_BUDGETS_COLLECTION_PATH}budget${expense.budgetId}`,
            },
            name: { stringValue: expense.name },
            price: { integerValue: expense.price },
            amount: { integerValue: expense.amount },
          },
        },
      };
    });

    return this.authService.userToken$.pipe(
      switchMap((token) => {
        return forkJoin({
          budgets: this.http.post(
            `${POST_BASE_URL}:commit`,
            {
              writes: budgets,
            },
            token
          ),
          expenses: this.http.post(
            `${POST_BASE_URL}:commit`,
            {
              writes: expenses,
            },
            token
          ),
        });
      }),
      tap((): void => this._refreshSub$.next())
    );
  }
}
