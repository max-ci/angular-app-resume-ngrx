export interface Stat {
  readonly budgetName: string;
  readonly budgetValue: number;
  readonly expensesValue: number;
  readonly budgetColor: string;
  readonly ratio: number;
  readonly isTotal: boolean;
}
