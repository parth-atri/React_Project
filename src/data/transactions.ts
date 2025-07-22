export type TransactionRecord = {
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
};

export const transactionsData: TransactionRecord[] = [
  {
    amount: 50,
    date: "2023-10-01",
    type: "expense",
    category: "Food",
  },
  {
    amount: 100,
    date: "2023-10-02",
    type: "income",
    category: "Salary",
  },
  {
    amount: 30,
    date: "2023-10-03",
    type: "expense",
    category: "Transport",
  },
  {
    amount: 200,
    date: "2023-10-04",
    type: "income",
    category: "Freelance Work",
  },
  {
    amount: 75,
    date: "2023-10-05",
    type: "expense",
    category: "Entertainment",
  },
];
