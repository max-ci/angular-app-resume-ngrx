import { Injectable } from '@angular/core';
import { Budget } from '../interfaces/budget.interface';
import { v4 as uuidv4 } from 'uuid';
import { budgetsData, expensesData } from '../data/budgets.data';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Expense } from '../interfaces/expense.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  readonly expenses$: Observable<Budget[]>;
  private readonly _searchString$: BehaviorSubject<string> =
    new BehaviorSubject('');

  budgetsColName: string = 'budgets';
  expensesColName: string = 'expenses';

  private readonly _budgetsCol: AngularFirestoreCollection<Budget> =
    this._afs.collection<Budget>(this.budgetsColName, (ref) =>
      ref.orderBy('name')
    );
  private readonly _expensesCol: AngularFirestoreCollection<Expense> =
    this._afs.collection<Expense>(this.expensesColName, (ref) =>
      ref.orderBy('name')
    );

  constructor(private _afs: AngularFirestore) {
    this.expenses$ = combineLatest({
      budgets: this._budgetsCol.valueChanges(),
      expenses: this._searchString$.pipe(
        switchMap((searchString) => {
          if (!searchString) {
            return this._expensesCol.valueChanges();
          } else {
            return this._afs
              .collection<Expense>(this.expensesColName, (ref) =>
                ref
                  .orderBy('name')
                  .startAt(searchString)
                  .endAt(`${searchString}\uf8ff`)
              )
              .valueChanges();
          }
        })
      ),
    }).pipe(
      map((data) => {
        return data.budgets.map((budget: Budget) => {
          const expenses = data.expenses.filter((expense: Expense) => {
            return budget.id === expense.budgetId;
          });

          return {
            ...budget,
            expenses,
          };
        });
      }),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getAll() {
    return this._budgetsCol.stateChanges();
  }

  get(id: string) {
    return this._afs
      .collection<Budget>(this.budgetsColName, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges()
      .pipe(take(1));
  }

  create(budget: Budget) {
    return of(this._budgetsCol.add({ ...budget, id: uuidv4() }));
  }

  update(budget: Budget) {
    return this._afs
      .collection<Budget>(this.budgetsColName, (ref) =>
        ref.where('id', '==', budget.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions?.[0]?.payload?.doc?.id;
        }),
        switchMap((documentId: string) => {
          return this._budgetsCol.doc<Budget>(documentId).update(budget);
        })
      );
  }

  delete(id: string) {
    return combineLatest({
      budgets: this._afs
        .collection<Budget>(this.budgetsColName, (ref) =>
          ref.where('id', '==', id)
        )
        .snapshotChanges(),
      expenses: this._afs
        .collection<Expense>(this.expensesColName, (ref) =>
          ref.where('budgetId', '==', id)
        )
        .snapshotChanges(),
    }).pipe(
      take(1),
      switchMap((data) => {
        const batch = this._afs.firestore.batch();

        data.budgets.forEach((budget) => {
          const deleteDoc = this._afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        data.expenses.forEach((expense) => {
          const deleteDoc = this._afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        return of(batch.commit());
      })
    );
  }

  getExpense(id: string) {
    return this._afs
      .collection<Expense>(this.expensesColName, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges()
      .pipe(take(1));
  }

  createExpense(expense: Expense) {
    return of(this._expensesCol.add({ ...expense, id: uuidv4() }));
  }

  updateExpense(expense: Expense) {
    return this._afs
      .collection<Expense>(this.expensesColName, (ref) =>
        ref.where('id', '==', expense.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions?.[0]?.payload?.doc?.id;
        }),
        switchMap((documentId: string) => {
          return this._expensesCol.doc<Expense>(documentId).update(expense);
        })
      );
  }

  deleteExpense(id: string) {
    return this._afs
      .collection<Expense>(this.expensesColName, (ref) =>
        ref.where('id', '==', id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions?.[0]?.payload?.doc?.id;
        }),
        switchMap((documentId: string) => {
          return this._expensesCol.doc<Expense>(documentId).delete();
        })
      );
  }

  setSearchString(searchString: string) {
    this._searchString$.next(searchString);
  }

  loadSampleData() {
    return combineLatest({
      budgets: this._budgetsCol.snapshotChanges(),
      expenses: this._expensesCol.snapshotChanges(),
    }).pipe(
      take(1),
      switchMap((data) => {
        const batch = this._afs.firestore.batch();

        data.budgets.forEach((budget) => {
          const deleteDoc = this._afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        data.expenses.forEach((expense) => {
          const deleteDoc = this._afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        budgetsData.forEach((budget: Budget) => {
          const insert = this._afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget.id).ref;
          batch.set(insert, budget);
        });

        expensesData.forEach((expense: Expense) => {
          const insert = this._afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense.id).ref;
          batch.set(insert, expense);
        });

        return of(batch.commit());
      })
    );
  }
}
