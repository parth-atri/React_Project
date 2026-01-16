import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container } from "react-bootstrap";

const NotFound404: React.FC = () => {
  return (
    <Container>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button variant="dark" href="/">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Go to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound404;
