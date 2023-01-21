import { Expense } from './expense';

export interface Budget {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly value: number;
  readonly expenses?: Expense[];
}
