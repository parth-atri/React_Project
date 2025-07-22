import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/dashboard");
  };
  return (
    <div className={styles.container}>
      <h1>Budget Buddy</h1>
      <p>Welcome to my react application</p>
      <Button variant="dark" onClick={handleGetStarted}>
        Get Started
      </Button>
    </div>
  );
};

export default LandingPage;
