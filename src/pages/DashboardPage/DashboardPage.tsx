import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import TransactionsTable from "../../components/TransactionsTable";
import { type TransactionRecord } from "../../types";
import styles from "./DashboardPage.module.css";

interface DashboardPageProps {
  transactionsHistoryList: TransactionRecord[] | [];
  onUpdateTransaction: (
    id: number,
    updatedTransactionRecord: TransactionRecord
  ) => void;
  onDeleteTransaction: (id: number) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  transactionsHistoryList,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const {
    totalExpensesOverall,
    totalIncomeOverall,
    totalExpensesThisMonth,
    totalIncomeThisMonth,
  } = useMemo(() => {
    let totalExpensesOverall = 0;
    let totalIncomeOverall = 0;
    let totalExpensesThisMonth = 0;
    let totalIncomeThisMonth = 0;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    transactionsHistoryList.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (transaction.type === "expense") {
        totalExpensesOverall += transaction.amount;
        if (
          transactionMonth === currentMonth &&
          transactionYear === currentYear
        ) {
          totalExpensesThisMonth += transaction.amount;
        }
      } else if (transaction.type === "income") {
        totalIncomeOverall += transaction.amount;
        if (
          transactionMonth === currentMonth &&
          transactionYear === currentYear
        ) {
          totalIncomeThisMonth += transaction.amount;
        }
      }
    });
    return {
      totalExpensesOverall,
      totalIncomeOverall,
      totalExpensesThisMonth,
      totalIncomeThisMonth,
    };
  }, [transactionsHistoryList]);

  return (
    <Container className="d-flex flex-column justify-content-center vh-100">
      <div className={styles.dashboardContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="">Dashboard</h1>
          <Button variant="primary" className={styles.newTransactionButton}>
            <a
              href="/new-transaction"
              className="text-white text-decoration-none"
            >
              <span>New Transaction</span>
            </a>
          </Button>
        </div>
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className={styles.metricCard}>
              <Card.Body>
                <Card.Title>Income This Month</Card.Title>
                <Card.Text className="text-success">
                  ${totalIncomeThisMonth.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={styles.metricCard}>
              <Card.Body>
                <Card.Title>Expenses This Month</Card.Title>
                <Card.Text className="text-danger">
                  ${totalExpensesThisMonth.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={styles.metricCard}>
              <Card.Body>
                <Card.Title>Total Income</Card.Title>
                <Card.Text className="text-success">
                  ${totalIncomeOverall.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className={styles.metricCard}>
              <Card.Body>
                <Card.Title>Total Expenses</Card.Title>
                <Card.Text className="text-danger">
                  ${totalExpensesOverall.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {transactionsHistoryList.length > 0 ? (
          <TransactionsTable
            transactionsHistoryList={transactionsHistoryList}
            onUpdateTransaction={onUpdateTransaction}
            onDeleteTransaction={onDeleteTransaction}
          />
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
