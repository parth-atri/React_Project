import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import { type TransactionRecord } from "../../types";
import TransactionForm from "../TransactionForm";
import styles from "./TransactionsTable.module.css";

type TableProps = {
  transactionsHistoryList: TransactionRecord[];
  onUpdateTransaction: (
    id: number,
    updatedTransactionRecord: TransactionRecord
  ) => void;
  onDeleteTransaction: (id: number) => void;
};

const TransactionsTable: React.FC<TableProps> = ({
  transactionsHistoryList,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [data, _setData] = useState([...transactionsHistoryList]);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const [editInitialValues, setEditInitialValues] = useState<
    TransactionRecord | undefined
  >(undefined);
  const [showEditOffcanvas, setShowEditOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    const transactionRecordToEdit = data.find(
      (transaction) => transaction.id === transactionId
    );
    setEditInitialValues(transactionRecordToEdit);
    setShowEditOffcanvas(true);
  };

  const handleEditFormSubmit = (
    updatedTransactionRecord: TransactionRecord
  ) => {
    if (selectedTransactionId) {
      onUpdateTransaction(selectedTransactionId, updatedTransactionRecord);
      handleEditOffcanvasClose();
    }
  };

  const handleEditOffcanvasClose = () => {
    setShowEditOffcanvas(false);
    setEditInitialValues(undefined);
    setSelectedTransactionId(null);
  };

  const handleDeleteClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (selectedTransactionId) {
      onDeleteTransaction(selectedTransactionId);
      handleDeleteModalClose();
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedTransactionId(null);
  };

  const columnHelper = createColumnHelper<TransactionRecord>();
  const columns = [
    columnHelper.accessor("amount", {
      cell: (info) => {
        const transactionType = info.row.original.type;
        const amount = info.getValue();
        const textColor =
          transactionType === "expense" ? "text-danger" : "text-success";
        return (
          <span className={textColor}>
            {transactionType === "expense" ? "-" : "+"}${amount.toFixed(2)}
          </span>
        );
      },
      header: () => "Amount ($)",
      sortingFn: (rowA, rowB) => {
        let amountA = rowA.getValue("amount") as number;
        let amountB = rowB.getValue("amount") as number;
        const typeA = rowA.original.type;
        const typeB = rowB.original.type;
        if (typeA === "expense") {
          amountA = -amountA;
        }
        if (typeB === "expense") {
          amountB = -amountB;
        }
        return amountA - amountB;
      },
    }),
    columnHelper.accessor("date", {
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString("en-US", {
          timeZone: "UTC",
        });
      },
      header: () => "Date",
      sortDescFirst: true,
      sortingFn: "datetime",
    }),
    columnHelper.accessor("category", {
      cell: (info) => info.getValue(),
      header: () => "Category",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <Button
            size="sm"
            className="me-2"
            onClick={() => handleEditClick(row.original.id)}
            variant="outline-primary"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => handleDeleteClick(row.original.id)}
            variant="outline-danger"
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const transactionsTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "date", desc: true }],
    },
  });

  useEffect(() => {
    _setData([...transactionsHistoryList]);
  }, [transactionsHistoryList]);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            {transactionsTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-center">
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? `${styles.tableHeaderText}`
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {transactionsTable.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Offcanvas
        show={showEditOffcanvas}
        onHide={handleEditOffcanvasClose}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Transaction</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {editInitialValues && (
            <TransactionForm
              initialValues={editInitialValues}
              onSubmit={handleEditFormSubmit}
              isEditMode={true}
            />
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this transaction? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default TransactionsTable;
