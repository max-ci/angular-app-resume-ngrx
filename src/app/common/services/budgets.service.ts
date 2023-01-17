import { Injectable } from '@angular/core';
import { Budget } from '../interfaces/budget';
import { v4 as uuidv4 } from 'uuid';
import { budgetsData, expensesData } from '../data/budgets.data';
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
import {
  parseFirestoreObject,
  prepareGetPayload,
} from '../helpers/firestore.helper';
import { HttpClientService } from './http-client.service';
import { AuthService } from './auth.service';
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
export class BudgetsService {
  public readonly budgets$: Observable<Budget[]>;
  private readonly _refreshSub$: BehaviorSubject<void>;

  constructor(
    private http: HttpClientService,
    private authService: AuthService
  ) {
    this._refreshSub$ = new BehaviorSubject<void>(undefined);

    this.budgets$ = this._refreshSub$.pipe(
      switchMap(() => this.authService.userToken$),
      switchMap((token: string) => {
        if (!token) {
          return of(null);
        }

        return this.http.post(
          `${POST_BASE_URL}:runQuery`,
          prepareGetPayload('budgets', 'name'),
          token
        );
      }),
      map((data: any) => {
        if (!data || !data?.[0]?.document) {
          return [];
        }

        return data.map((obj: any) => {
          const budget = parseFirestoreObject(obj.document.fields);
          return { ...budget, id: obj.document.name };
        });
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  create(budget: Budget) {
    return this.authService.userToken$.pipe(
      switchMap((token: string) => {
        return this.http.post(
          `${POST_BASE_URL}/budgets`,
          {
            fields: {
              id: { stringValue: uuidv4() },
              name: { stringValue: budget.name },
              color: { stringValue: budget.color },
              value: { integerValue: budget.value },
            },
          },
          token
        );
      }),
      tap((): void => {
        this._refreshSub$.next();
      })
    );
  }

  update(updatedBudget: Budget) {
    return this.authService.userToken$.pipe(
      switchMap((token: string) => {
        return this.http.post(
          `${POST_BASE_URL}:commit`,
          {
            writes: [
              {
                update: {
                  name: updatedBudget.id,
                  fields: {
                    id: { stringValue: updatedBudget.id },
                    name: { stringValue: updatedBudget.name },
                    color: { stringValue: updatedBudget.color },
                    value: {
                      integerValue: updatedBudget.value,
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

  delete(id: string) {
    return this.authService.userToken$.pipe(
      switchMap((token: string) => {
        return this.http.delete(`${DELETE_BASE_URL}${id}`, token);
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
      switchMap((token: string) => {
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
