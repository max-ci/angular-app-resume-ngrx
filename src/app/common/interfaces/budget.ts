import { Expense } from './expense';

export interface Budget {
  id: string;
  name: string;
  color: string;
  value: number;
  expenses?: Expense[];
}
