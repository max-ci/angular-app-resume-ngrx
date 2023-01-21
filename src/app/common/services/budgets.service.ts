import { Injectable } from '@angular/core';
import { Budget } from '../interfaces/budget';
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
import { Expense } from '../interfaces/expense';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  public readonly budgets$: Observable<Budget[]>;
  public readonly expenses$: Observable<Budget[]>;
  private readonly searchString$: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  budgetsColName: string = 'budgets';
  expensesColName: string = 'expenses';

  public readonly budgetsCol: AngularFirestoreCollection<Budget> =
    this.afs.collection<Budget>(this.budgetsColName, (ref) =>
      ref.orderBy('name')
    );
  public readonly expensesCol: AngularFirestoreCollection<Expense> =
    this.afs.collection<Expense>(this.expensesColName, (ref) =>
      ref.orderBy('name')
    );

  constructor(private afs: AngularFirestore) {
    this.budgets$ = this.budgetsCol.valueChanges().pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.expenses$ = combineLatest({
      budgets: this.budgetsCol.valueChanges(),
      expenses: this.searchString$.pipe(
        switchMap((searchString) => {
          if (!searchString) {
            return this.expensesCol.valueChanges();
          } else {
            return this.afs
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

  get(id: string) {
    return this.afs
      .collection<Budget>(this.budgetsColName, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges()
      .pipe(take(1));
  }

  create(budget: Budget) {
    return of(this.budgetsCol.add({ ...budget, id: uuidv4() }));
  }

  update(budget: Budget) {
    return this.afs
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
          return this.budgetsCol.doc<Budget>(documentId).update(budget);
        })
      );
  }

  delete(id: string) {
    return combineLatest({
      budgets: this.afs
        .collection<Budget>(this.budgetsColName, (ref) =>
          ref.where('id', '==', id)
        )
        .snapshotChanges(),
      expenses: this.afs
        .collection<Expense>(this.expensesColName, (ref) =>
          ref.where('budgetId', '==', id)
        )
        .snapshotChanges(),
    }).pipe(
      take(1),
      switchMap((data) => {
        const batch = this.afs.firestore.batch();

        data.budgets.forEach((budget) => {
          const deleteDoc = this.afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        data.expenses.forEach((expense) => {
          const deleteDoc = this.afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        return of(batch.commit());
      })
    );
  }

  getExpense(id: string) {
    return this.afs
      .collection<Expense>(this.expensesColName, (ref) =>
        ref.where('id', '==', id)
      )
      .valueChanges()
      .pipe(take(1));
  }

  createExpense(expense: Expense) {
    return of(this.expensesCol.add({ ...expense, id: uuidv4() }));
  }

  updateExpense(expense: Expense) {
    return this.afs
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
          return this.expensesCol.doc<Budget>(documentId).update(expense);
        })
      );
  }

  deleteExpense(id: string) {
    return of(this.expensesCol.doc<Budget>(id).delete());
  }

  setSearchString(searchString: string) {
    this.searchString$.next(searchString);
  }

  loadSampleData() {
    return combineLatest({
      budgets: this.budgetsCol.snapshotChanges(),
      expenses: this.expensesCol.snapshotChanges(),
    }).pipe(
      take(1),
      switchMap((data) => {
        const batch = this.afs.firestore.batch();

        data.budgets.forEach((budget) => {
          const deleteDoc = this.afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        data.expenses.forEach((expense) => {
          const deleteDoc = this.afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense?.payload?.doc?.id).ref;
          batch.delete(deleteDoc);
        });

        budgetsData.forEach((budget: Budget) => {
          const insert = this.afs
            .collection<Budget>(this.budgetsColName)
            .doc<Budget>(budget.id).ref;
          batch.set(insert, budget);
        });

        expensesData.forEach((expense: Expense) => {
          const insert = this.afs
            .collection<Expense>(this.expensesColName)
            .doc<Expense>(expense.id).ref;
          batch.set(insert, expense);
        });

        return of(batch.commit());
      })
    );
  }
}
