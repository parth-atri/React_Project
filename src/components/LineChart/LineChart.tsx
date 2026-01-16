import { ResponsiveLine } from "@nivo/line";
import React, { useEffect, useState } from "react";
import { type TransactionRecord } from "../../types";

interface LineChartProps {
  transactionsHistoryList: TransactionRecord[] | [];
  // chartData: { id: string; color: string; data: { x: string; y: number }[] }[];
}

const LineChart: React.FC<LineChartProps> = ({ transactionsHistoryList }) => {
  const [chartData, setChartData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);
  const getChartData = () => {
    const dataMap: { [key: string]: { income: number; expense: number } } = {};
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    transactionsHistoryList.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < oneYearAgo) return; // Ignoring the transactions older than one year

      const monthKey = `${transactionDate.getUTCFullYear()}-${
        transactionDate.getUTCMonth() + 1
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
  };

  useEffect(() => {
    setChartData(getChartData);
  }, [transactionsHistoryList]);

  return (
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
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: "Time (Months)",
        legendOffset: 45,
        legendPosition: "middle",
        truncateTickAt: 55,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Amount ($)",
        legendOffset: -45,
        legendPosition: "middle",
      }}
      pointSize={5}
      pointColor={{ theme: "background" }}
      pointBorderColor={{ from: "serieColor" }}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
        },
      ]}
      colors={["#28a745", "#dc3545"]}
      enableArea={true}
      animate={true}
    />
  );
};

export default LineChart;
