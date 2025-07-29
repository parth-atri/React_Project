import {
  faFileInvoiceDollar,
  faMoneyBill1Wave,
  faPlus,
  faReceipt,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import LineChart from "../../components/LineChart/LineChart";
import MetricCard from "../../components/MetricCard";
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
      const transactionMonth = transactionDate.getUTCMonth();
      const transactionYear = transactionDate.getUTCFullYear();

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
    <Container className="d-flex flex-column justify-content-center">
      <div className={styles.dashboardContainer}>
        <Row className="d-flex justify-content-between align-items-center my-4">
          <Col md={6}>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="primary" className={styles.newTransactionButton}>
              <a
                href="/new-transaction"
                className="text-white text-decoration-none"
              >
                <span>
                  Add{" "}
                  <FontAwesomeIcon
                    icon={faPlus}
                    title="Add a new transaction"
                  />
                </span>
              </a>
            </Button>
          </Col>
        </Row>

        {transactionsHistoryList.length > 0 ? (
          <div className="mb-4">
            <Row className="mb-4">
              <MetricCard
                titleText="Income This Month"
                valueText={totalIncomeThisMonth}
                valueType="income"
                iconName={faMoneyBill1Wave}
              />
              <MetricCard
                titleText="Expenses This Month"
                valueText={totalExpensesThisMonth}
                valueType="expense"
                iconName={faReceipt}
              />
              <MetricCard
                titleText="Total Income"
                valueText={totalIncomeOverall}
                valueType="income"
                iconName={faSackDollar}
              />
              <MetricCard
                titleText="Total Expenses"
                valueText={totalExpensesOverall}
                valueType="expense"
                iconName={faFileInvoiceDollar}
              />
            </Row>

            <Row className="mb-4 mx-0">
              <Card className="p-0">
                <Card.Header>Income vs. Expenses (Past Year)</Card.Header>
                <Card.Body style={{ height: "400px" }}>
                  <LineChart
                    transactionsHistoryList={transactionsHistoryList}
                  />
                </Card.Body>
              </Card>
            </Row>

            <TransactionsTable
              transactionsHistoryList={transactionsHistoryList}
              onUpdateTransaction={onUpdateTransaction}
              onDeleteTransaction={onDeleteTransaction}
            />
          </div>
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
