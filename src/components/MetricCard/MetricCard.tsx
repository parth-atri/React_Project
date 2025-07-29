import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col } from "react-bootstrap";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  titleText: string;
  valueText: number;
  valueType: string;
  iconName: FontAwesomeIconProps["icon"];
}

const MetricCard: React.FC<MetricCardProps> = ({
  titleText,
  valueText,
  valueType,
  iconName,
}) => {
  return (
    <Col md={3} className="mb-3">
      <Card className={styles.metricCard}>
        <Card.Body>
          <Card.Title>
            <FontAwesomeIcon icon={iconName} /> {titleText}
          </Card.Title>
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
