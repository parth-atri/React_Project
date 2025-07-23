import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import NewTransactionPage from "./pages/NewTransactionPage";
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
      })
      .catch((error) => console.error("Error:", error));

    setTransactionsHistoryList((prevTransactionHistory) => [
      ...prevTransactionHistory,
      newTransactionRecord,
    ]);
  };

  useEffect(() => {
    getTransactionsHistoryList();
  }, [transactionsHistoryList]);

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
        {/* TODO: Add other routes including a Not Found Route to catch 404 redirects. */}
      </Routes>
    </Router>
  );
}

export default App;
