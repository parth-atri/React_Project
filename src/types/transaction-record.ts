export type TransactionRecord = {
  amount: number;
  date: string;
  type: "" | "income" | "expense";
  category: string;
};
