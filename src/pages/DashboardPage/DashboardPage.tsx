import React from "react";
import TransactionsTable from "../../components/TransactionsTable";
import { transactionsData } from "../../data/transactions";
import styles from "./DashboardPage.module.css";

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {transactionsData.length > 0 ? (
        <div className={styles.dashboardContainer}>
          <h1>Dashboard</h1>
          <TransactionsTable transactionsData={transactionsData} />
        </div>
      ) : (
        <div className={styles.noTransactions}>
          <h2>No transactions available</h2>
          <p>Please add some transactions to view them here.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
