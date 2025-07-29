import React from "react";
import { Card, Col } from "react-bootstrap";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  titleText: string;
  valueText: number;
  valueType: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  titleText,
  valueText,
  valueType,
}) => {
  return (
    <Col md={3} className="mb-3">
      <Card className={styles.metricCard}>
        <Card.Body>
          <Card.Title>{titleText}</Card.Title>
          <Card.Text
            className={valueType === "income" ? "text-success" : "text-danger"}
          >
            ${valueText.toFixed(2)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MetricCard;
