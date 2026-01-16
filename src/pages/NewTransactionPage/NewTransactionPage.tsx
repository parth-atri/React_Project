import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import TransactionForm from "../../components/TransactionForm";
import { type TransactionRecord } from "../../types";

interface NewTransactionPageProps {
  onAddTransaction: (data: TransactionRecord) => void;
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({
  onAddTransaction,
}) => {
  const navigate = useNavigate();

  const onSubmit = (data: TransactionRecord) => {
    onAddTransaction(data);
    navigate("/dashboard");
  };

  const handleCancelBtnClick = () => {
    navigate("/dashboard");
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Add New Transaction</h2>
          <TransactionForm
            onSubmit={onSubmit}
            handleCancelBtnClick={handleCancelBtnClick}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default NewTransactionPage;
