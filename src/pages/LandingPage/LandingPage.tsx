import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/dashboard");
  };
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1>Budget Buddy</h1>
      <p>Welcome to my react application</p>
      <Button variant="dark" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;
