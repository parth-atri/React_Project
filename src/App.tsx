import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <DashboardPage />
            </>
          }
        />
        {/* TODO: Add other routes including a Not Found Route to catch 404 redirects. */}
      </Routes>
    </Router>
  );
}

export default App;
