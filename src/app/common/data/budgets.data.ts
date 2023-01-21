import { Budget } from '../interfaces/budget';
import { Expense } from '../interfaces/expense';

export const budgetsData: Budget[] = [
  {
    id: '1',
    name: 'Home',
    color: '#0d6efd',
    value: 3000,
  },
  {
    id: '2',
    name: 'Transportation',
    color: '#198754',
    value: 1000,
  },
  {
    id: '3',
    name: 'Daily living',
    color: '#0dcaf0',
    value: 1000,
  },
  {
    id: '4',
    name: 'Entertainment',
    color: '#ff0066',
    value: 500,
  },
  {
    id: '5',
    name: 'Health',
    color: '#ffc107',
    value: 200,
  },
  {
    id: '6',
    name: 'Vacation / holiday',
    color: '#d65b4b',
    value: 2000,
  },
];

export const expensesData: Expense[] = [
  {
    id: '1',
    budgetId: '1',
    name: 'Mortgage/Rent',
    amount: 1,
    price: 2250,
  },
  {
    id: '2',
    budgetId: '1',
    name: 'Home/Rental Insurance',
    amount: 1,
    price: 25,
  },
  {
    id: '3',
    budgetId: '1',
    name: 'Electricity',
    amount: 1,
    price: 40,
  },
  {
    id: '4',
    budgetId: '1',
    name: 'Gas/Oil',
    amount: 1,
    price: 44,
  },
  {
    id: '5',
    budgetId: '1',
    name: 'Water/Sewer/Trash',
    amount: 1,
    price: 20,
  },
  {
    id: '6',
    budgetId: '1',
    name: 'Phone',
    amount: 1,
    price: 15,
  },
  {
    id: '7',
    budgetId: '1',
    name: 'Cable/Satellite',
    amount: 1,
    price: 18,
  },
  {
    id: '8',
    budgetId: '1',
    name: 'Internet',
    amount: 1,
    price: 29,
  },
  {
    id: '9',
    budgetId: '1',
    name: 'Furnishing/Appliances',
    amount: 1,
    price: 30,
  },
  {
    id: '10',
    budgetId: '1',
    name: 'Lawn/Garden',
    amount: 1,
    price: 10,
  },
  {
    id: '11',
    budgetId: '1',
    name: 'Maintenance/Improvements',
    amount: 1,
    price: 22,
  },
  {
    id: '12',
    budgetId: '1',
    name: 'Other',
    amount: 3,
    price: 50,
  },

  {
    id: '13',
    budgetId: '2',
    name: 'Car Payments',
    amount: 1,
    price: 250,
  },
  {
    id: '14',
    budgetId: '2',
    name: 'Auto Insurance',
    amount: 1,
    price: 100,
  },
  {
    id: '15',
    budgetId: '2',
    name: 'Fuel',
    amount: 1,
    price: 100,
  },
  {
    id: '16',
    budgetId: '2',
    name: 'Public Transportation',
    amount: 2,
    price: 10,
  },
  {
    id: '17',
    budgetId: '2',
    name: 'Repairs/Maintenance',
    amount: 1,
    price: 150,
  },
  {
    id: '18',
    budgetId: '2',
    name: 'Registration/License',
    amount: 1,
    price: 30,
  },
  {
    id: '19',
    budgetId: '3',
    name: 'Groceries',
    amount: 6,
    price: 40,
  },
  {
    id: '20',
    budgetId: '3',
    name: 'Child Care',
    amount: 1,
    price: 100,
  },
  {
    id: '21',
    budgetId: '3',
    name: 'Dining Out',
    amount: 1,
    price: 120,
  },
  {
    id: '22',
    budgetId: '3',
    name: 'Clothing',
    amount: 1,
    price: 40,
  },
  {
    id: '23',
    budgetId: '3',
    name: 'Cleaning',
    amount: 1,
    price: 40,
  },
  {
    id: '24',
    budgetId: '4',
    name: 'Video/DVD/Movies',
    amount: 1,
    price: 250,
  },
  {
    id: '25',
    budgetId: '4',
    name: 'Concerts/Plays',
    amount: 1,
    price: 100,
  },
  {
    id: '26',
    budgetId: '4',
    name: 'Sports',
    amount: 1,
    price: 100,
  },
  {
    id: '27',
    budgetId: '4',
    name: 'Outdoor Recreation',
    amount: 1,
    price: 120,
  },
  {
    id: '28',
    budgetId: '5',
    name: 'Health Insurance',
    amount: 1,
    price: 65,
  },
  {
    id: '29',
    budgetId: '5',
    name: 'Gym Membership',
    amount: 1,
    price: 20,
  },
  {
    id: '30',
    budgetId: '5',
    name: 'Doctors/Dentist Visits',
    amount: 1,
    price: 40,
  },
  {
    id: '31',
    budgetId: '5',
    name: 'Medicine/Prescriptions',
    amount: 2,
    price: 10,
  },
  {
    id: '32',
    budgetId: '5',
    name: 'Life Insurance',
    amount: 1,
    price: 11,
  },
  {
    id: '33',
    budgetId: '6',
    name: 'Airfare',
    amount: 1,
    price: 450,
  },
  {
    id: '34',
    budgetId: '6',
    name: 'Accommodations',
    amount: 1,
    price: 250,
  },
  {
    id: '35',
    budgetId: '6',
    name: 'Food',
    amount: 1,
    price: 200,
  },
  {
    id: '36',
    budgetId: '6',
    name: 'Souvenirs',
    amount: 1,
    price: 50,
  },
  {
    id: '37',
    budgetId: '6',
    name: 'Rental Car',
    amount: 1,
    price: 150,
  },
];
