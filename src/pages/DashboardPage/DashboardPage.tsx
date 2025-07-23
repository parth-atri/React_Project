import React from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import TransactionsTable from "../../components/TransactionsTable";
import { type TransactionRecord } from "../../data/transactions";
import styles from "./DashboardPage.module.css";

interface DashboardPageProps {
  transactionsData: TransactionRecord[] | [];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ transactionsData }) => {
  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <div className={styles.dashboardContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="">Dashboard</h1>
          <Button
            variant="primary"
            className={styles.newTransactionButton}
            href="/new-transaction"
          >
            New Transaction
          </Button>
        </div>
        {transactionsData.length > 0 ? (
          <TransactionsTable transactionsData={transactionsData} />
        ) : (
          <div className={styles.noTransactions}>
            <h2>No transactions available</h2>
            <p>Please add some transactions to view them here.</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default DashboardPage;
