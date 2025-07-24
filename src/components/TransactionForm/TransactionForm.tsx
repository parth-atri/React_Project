import React, { useEffect } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import type { TransactionRecord } from "../../types";

interface TransactionFormProps {
  initialValues?: TransactionRecord;
  onSubmit: (values: TransactionRecord) => void;
  isEditMode?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  onSubmit,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionRecord>({
    defaultValues: initialValues || {
      amount: 0,
      type: "",
      date: new Date().toISOString().slice(0, 10),
      category: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="amount">
        <Form.Label>Amount</Form.Label>
        <InputGroup>
          <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
          <Form.Control
            type="number"
            step="0.01"
            placeholder="Enter amount (USD)"
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: 0.01,
                message: "Amount must be greater than 0",
              },
              valueAsNumber: true,
            })}
            isInvalid={!!errors.amount}
          />
        </InputGroup>
        {errors.amount && (
          <Alert variant="danger" className="mt-2">
            {errors.amount.message}
          </Alert>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          {...register("date", { required: "Date is required" })}
          isInvalid={!!errors.date}
        />
        {errors.date && (
          <Alert variant="danger" className="mt-2">
            {errors.date.message}
          </Alert>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="type">
        <Form.Label>Type</Form.Label>
        <Form.Select
          {...register("type", { required: "Type is required" })}
          isInvalid={!!errors.type}
        >
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Form.Select>
        {errors.type && (
          <Alert variant="danger" className="mt-2">
            {errors.type.message}
          </Alert>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category"
          {...register("category", { required: "Category is required" })}
          isInvalid={!!errors.category}
        />
        {errors.category && (
          <Alert variant="danger" className="mt-2">
            {errors.category.message}
          </Alert>
        )}
      </Form.Group>

      <Button variant="primary" type="submit">
        {isEditMode ? "Save Changes" : "Add a Transaction"}
      </Button>
    </Form>
  );
};

export default TransactionForm;
