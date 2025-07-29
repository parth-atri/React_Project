import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Offcanvas, Row } from "react-bootstrap";
import { type TransactionRecord } from "../../types";
import TransactionForm from "../TransactionForm";
import styles from "./TransactionsTable.module.css";

import {
  faCircleDown,
  faCircleUp,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
        return <span className={textColor}>${amount.toFixed(2)}</span>;
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
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
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
            <FontAwesomeIcon icon={faPenToSquare} title="Edit Transaction" />
          </Button>
          <Button
            size="sm"
            onClick={() => handleDeleteClick(row.original.id)}
            variant="outline-danger"
          >
            <FontAwesomeIcon icon={faTrashCan} title="Delete Transaction" />
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
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
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
                        )}{" "}
                        {{
                          asc: <FontAwesomeIcon icon={faCircleUp} />,
                          desc: <FontAwesomeIcon icon={faCircleDown} />,
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
        <div className="m-3">
          <Row className="">
            <Col>
              Page{" "}
              <strong>
                {transactionsTable.getState().pagination.pageIndex + 1} of{" "}
                {transactionsTable.getPageCount().toLocaleString()}
              </strong>
            </Col>
            <Col className="text-center">
              <Button
                className="border rounded p-1 me-2"
                variant="outline"
                onClick={() => transactionsTable.firstPage()}
                disabled={!transactionsTable.getCanPreviousPage()}
              >
                {"<<"}
              </Button>
              <Button
                className="border rounded p-1 me-2"
                variant="outline"
                onClick={() => transactionsTable.previousPage()}
                disabled={!transactionsTable.getCanPreviousPage()}
              >
                {"<"}
              </Button>
              <Button
                className="border rounded p-1 me-2"
                variant="outline"
                onClick={() => transactionsTable.nextPage()}
                disabled={!transactionsTable.getCanNextPage()}
              >
                {">"}
              </Button>
              <Button
                className="border rounded p-1"
                variant="outline"
                onClick={() => transactionsTable.lastPage()}
                disabled={!transactionsTable.getCanNextPage()}
              >
                {">>"}
              </Button>
            </Col>
            <Col className="d-flex justify-content-end">
              <span className="flex items-center gap-1 ms-3 me-2">
                Go to page:{" "}
                <input
                  type="number"
                  min="1"
                  max={transactionsTable.getPageCount()}
                  defaultValue={
                    transactionsTable.getState().pagination.pageIndex + 1
                  }
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    transactionsTable.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={transactionsTable.getState().pagination.pageSize}
                onChange={(e) => {
                  transactionsTable.setPageSize(Number(e.target.value));
                }}
                className="form-select w-auto"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize} Records
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        </div>
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
