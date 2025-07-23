import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { type TransactionRecord } from "../../types";

type TableProps = {
  transactionsHistoryList: TransactionRecord[];
};

const TransactionsTable: React.FC<TableProps> = ({
  transactionsHistoryList,
}) => {
  const [data, _setData] = useState([...transactionsHistoryList]);
  const columnHelper = createColumnHelper<TransactionRecord>();
  const columns = [
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
  ];

  const transactionsTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
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
  );
};
export default TransactionsTable;
