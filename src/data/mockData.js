/**
 * mockData.js — Datos de ejemplo para ORCA Financing App.
 * En una versión real estos vendrían de una API o Context/state global.
 */

export const weeklySpendingData = [
  { label: 'Mon', value: 820 },
  { label: 'Tue', value: 340 },
  { label: 'Wed', value: 1200 },
  { label: 'Thu', value: 580 },
  { label: 'Fri', value: 760 },
  { label: 'Sat', value: 210 },
  { label: 'Sun', value: 490 },
]

export const monthlySpendingData = [
  { label: '1', value: 820 },
  { label: '2', value: 340 },
  { label: '3', value: 1200 },
  { label: '4', value: 580 },
  { label: '5', value: 760 },
  { label: '6', value: 210 },
  { label: '7', value: 490 },
]

export const transactions = [
  {
    id: 1,
    name: 'Kapu Coffee',
    category: 'Service',
    date: 'April 22',
    amount: '-$4,00',
    type: 'expense',
    group: 'TODAY',
  },
  {
    id: 2,
    name: 'HBO Max',
    category: 'Subscription',
    date: 'April 22',
    amount: '-$11,99',
    type: 'expense',
    group: 'TODAY',
  },
  {
    id: 3,
    name: 'Groceries Deposit',
    category: 'Income',
    date: 'April 21',
    amount: '+$45.00',
    type: 'income',
    group: 'YESTERDAY',
  },
  {
    id: 4,
    name: "Cinemark Ticket",
    category: 'Service',
    date: 'April 21',
    amount: '-$4,00',
    type: 'expense',
    group: 'YESTERDAY',
  },
  {
    id: 5,
    name: "Client's Job",
    category: 'Income',
    date: 'April 21',
    amount: '+$100.00',
    type: 'income',
    group: 'YESTERDAY',
  },
  {
    id: 6,
    name: 'Weekly Deposit',
    category: 'Income',
    date: 'April 20',
    amount: '+$250.65',
    type: 'income',
    group: 'April, 20th',
  },
  {
    id: 7,
    name: 'Weekly Savings',
    category: 'Expense',
    date: 'April 20',
    amount: '-$15.00',
    type: 'expense',
    group: 'April, 20th',
  },
  {
    id: 8,
    name: 'Electricity',
    category: 'Service',
    date: 'April 20',
    amount: '-$10.00',
    type: 'expense',
    group: 'April, 20th',
  },
  {
    id: 9,
    name: '3AM Event Ticket',
    category: 'Service',
    date: 'April 20',
    amount: '-$60.00',
    type: 'expense',
    group: 'April, 20th',
  },
]

export const recentTransactions = [
  {
    id: 10,
    name: 'NETFLIX',
    category: 'Subscription',
    date: 'Mar 22',
    amount: '-$11.00',
    type: 'expense',
  },
  {
    id: 11,
    name: 'CLIENT JOB',
    category: 'Deposit',
    date: 'Mar 22',
    amount: '+$50.00',
    type: 'income',
  },
  {
    id: 12,
    name: 'CLAUDE',
    category: 'Subscription',
    date: 'Mar 22',
    amount: '-$20.00',
    type: 'expense',
  },
]

export const expenseCategories = [
  { name: 'Housing',       description: 'Rent, mortgage, or basic utilities (water, electricity).' },
  { name: 'Food & Dining', description: 'Restaurants, cafés, and bars.' },
  { name: 'Groceries',     description: 'Supermarket and market purchases.' },
  { name: 'Transportation',description: 'Gas, public transit, car maintenance, or bike repairs.' },
  { name: 'Subscriptions', description: 'Netflix, HBO Max, Claude, and other recurring services.' },
  { name: 'Shopping',      description: 'Clothing, electronics, and household items.' },
  { name: 'Health',        description: 'Pharmacy, medical appointments, and health insurance.' },
  { name: 'Personal Care', description: 'Barbershop/salon, gym, or cosmetics.' },
  { name: 'Education',     description: 'Courses, books, or technical certifications.' },
  { name: 'Entertainment', description: 'Cinema, concerts, and hobbies.' },
]

export const incomeCategories = [
  { name: 'Salary',        description: 'Your main payroll or monthly net salary.' },
  { name: 'Freelance',     description: 'Payments for external projects or independent design/development work.' },
  { name: 'Sales',         description: 'Money earned from selling items you no longer use.' },
  { name: 'Investments',   description: 'Dividends or returns from savings accounts or partnerships.' },
  { name: 'Bonuses',       description: 'Performance bonuses, year-end bonuses, or extra commissions.' },
  { name: 'Gifts',         description: 'Money received for birthdays or holidays.' },
  { name: 'Refunds',       description: 'Tax returns or refunds from cancelled purchases.' },
  { name: 'Rental Income', description: 'Income from rented property or assets.' },
  { name: 'Interests',     description: 'Interest generated in bank accounts.' },
  { name: 'Other',         description: 'A catch-all for unexpected or minor income.' },
]
