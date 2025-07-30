import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import NewTransactionPage from "./pages/NewTransactionPage";
import NotFound404 from "./pages/NotFound404";
import { type TransactionRecord } from "./types/transaction-record";

function App() {
  const [transactionsHistoryList, setTransactionsHistoryList] = useState<
    TransactionRecord[]
  >([]);

  const getTransactionsHistoryList = () => {
    fetch("http://localhost:3030/transactions")
      .then((response) => response.json())
      .then((transactionsData) => setTransactionsHistoryList(transactionsData))
      .catch((error) => console.log("error", error));
  };

  const handleAddTransaction = (newTransactionRecord: TransactionRecord) => {
    fetch("http://localhost:3030/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransactionRecord),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        getTransactionsHistoryList();
      })
      .catch((error) => console.error("Error:", error));

    setTransactionsHistoryList((prevTransactionHistory) => [
      ...prevTransactionHistory,
      newTransactionRecord,
    ]);
  };

  const handleUpdateTransaction = (
    id: number,
    updatedTransactionRecord: TransactionRecord
  ) => {
    fetch(`http://localhost:3030/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTransactionRecord),
    })
      .then((response) => response.json())
      .then((updatedTransactionRecord) => {
        setTransactionsHistoryList((prevTransactionHistory) =>
          prevTransactionHistory.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updatedTransactionRecord }
              : transaction
          )
        );
        getTransactionsHistoryList();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteTransaction = (id: number) => {
    fetch(`http://localhost:3030/transactions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTransactionsHistoryList((prevTransactionHistory) =>
          prevTransactionHistory.filter((transaction) => transaction.id !== id)
        );
        getTransactionsHistoryList();
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    getTransactionsHistoryList();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <DashboardPage
                transactionsHistoryList={transactionsHistoryList}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </>
          }
        />
        <Route
          path="/new-transaction"
          element={
            <>
              <NavBar />
              <NewTransactionPage onAddTransaction={handleAddTransaction} />
            </>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
}

export default App;
