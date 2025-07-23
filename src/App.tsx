import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import { type TransactionRecord } from "./data/transactions";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import NewTransactionPage from "./pages/NewTransactionPage";

function App() {
  const [transactionsList, setTransactionsList] = useState<TransactionRecord[]>(
    []
  );

  const handleAddTransaction = (newTransaction: TransactionRecord) => {
    setTransactionsList((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <DashboardPage transactionsData={transactionsList} />
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
