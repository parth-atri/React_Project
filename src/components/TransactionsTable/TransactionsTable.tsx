import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import { type TransactionRecord } from "../../types";
import TransactionForm from "../TransactionForm";

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
    columnHelper.display({
      id: "rowNumber",
      header: () => "#",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("amount", {
      cell: (info) => info.getValue(),
      header: () => "Amount ($)",
    }),
    columnHelper.accessor("date", {
      cell: (info) => info.getValue(),
      header: () => "Date",
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
      header: () => "Type",
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
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                  <td key={cell.id}>
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
