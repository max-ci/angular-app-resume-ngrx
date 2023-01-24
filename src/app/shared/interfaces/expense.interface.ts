export interface Expense {
  readonly id: string;
  readonly budgetId: string;
  readonly name: string;
  readonly amount: number;
  readonly price: number;
}
