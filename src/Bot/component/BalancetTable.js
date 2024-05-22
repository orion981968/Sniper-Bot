import React from "react";

import { useTable, usePagination } from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import "bootstrap/dist/css/bootstrap.min.css";

function BalanceTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

  const classes = useStyles();

  // Render the UI for your table
  return (
    <div>
      <table className="table" {...getTableProps()} style={{textAlign:"center"}}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}> <span>{cell.render("Cell")}</span></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PaginationTableComponent({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Wallet",
        columns: [
          {
            Header: "Token",
            accessor: "token",
          },
          {
            Header: "Balance",
            accessor: "balance",
          },
        ],
      },
    ],
    []
  );

  return <BalanceTable columns={columns} data={data} />;
}

export default PaginationTableComponent;
