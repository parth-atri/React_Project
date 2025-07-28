import { ResponsiveLine } from "@nivo/line";
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

  const chartData = useMemo(() => {
    const dataMap: { [key: string]: { income: number; expense: number } } = {};
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    transactionsHistoryList.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < oneYearAgo) return; // Ignoring the transactions older than one year

      const monthKey = `${transactionDate.getFullYear()}-${
        transactionDate.getMonth() + 1
      }`;

      if (!dataMap[monthKey]) {
        dataMap[monthKey] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        dataMap[monthKey].income += transaction.amount;
      } else if (transaction.type === "expense") {
        dataMap[monthKey].expense += transaction.amount;
      }
    });

    const incomeData = [];
    const expenseData = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
      incomeData.unshift({ x: monthKey, y: dataMap[monthKey]?.income || 0 });
      expenseData.unshift({ x: monthKey, y: dataMap[monthKey]?.expense || 0 });
    }

    return [
      {
        id: "Income",
        color: "hsl(120, 70%, 50%)",
        data: incomeData,
      },
      {
        id: "Expenses",
        color: "hsl(0, 70%, 50%)",
        data: expenseData,
      },
    ];
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
                <span>New Transaction</span>
              </a>
            </Button>
          </Col>
        </Row>

        {transactionsHistoryList.length > 0 ? (
          <div className="mb-4">
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

            <Row className="mb-4 mx-0">
              <Card className="p-0">
                <Card.Header>Income vs. Expenses (Past Year)</Card.Header>
                <Card.Body style={{ height: "400px" }}>
                  <ResponsiveLine
                    data={chartData}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: "point" }}
                    yScale={{
                      type: "linear",
                      min: "auto",
                      max: "auto",
                      stacked: false,
                      reverse: false,
                    }}
                    curve="monotoneX"
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 45,
                      legend: "Time (Months)",
                      legendOffset: 36,
                      legendPosition: "middle",
                      truncateTickAt: 50,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Amount ($)",
                      legendOffset: -40,
                      legendPosition: "middle",
                    }}
                    pointSize={10}
                    pointColor={{ theme: "background" }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor" }}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    legends={[
                      {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemBackground: "rgba(0, 0, 0, .03)",
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                    colors={["#28a745", "#dc3545"]} // Green for Income, Red for Expenses
                    enableArea={true}
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
