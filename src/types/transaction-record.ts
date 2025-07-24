export type TransactionRecord = {
  id: number;
  amount: number;
  date: string;
  type: "" | "income" | "expense";
  category: string;
};
