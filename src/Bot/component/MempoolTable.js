import React from "react";

import { useTable, usePagination } from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import "bootstrap/dist/css/bootstrap.min.css";

function MempoolTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
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
    root: {
      flexGrow: 1,
      padding: 50
    },
    tbl_margin: {
      marginTop: 50,
    },
    tbl_header: {
      fontSize: 8,
    }
  }));

  const classes = useStyles();

  // Render the UI for your table
  return (
    <div>
      <table className="table" {...getTableProps()}>
        <thead >
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
                    <td {...cell.getCellProps()}>
                      <pre>{cell.render("Cell")}</pre>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <ul className="pagination">
        <li
          className="page-item"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <a className="page-link" href="http://localhost">First</a>
        </li>
        <li
          className="page-item"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <a className="page-link" href="http://localhost">{"<"}</a>
        </li>
        <li className="page-item">
          <a className="page-link" href="http://localhost">{pageIndex + 1}</a>
        </li>
        <li
          className="page-item"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <a className="page-link" href="https://localhost">{">"}</a>
        </li>
        <li
          className="page-item"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <a className="page-link" href="https://localhost">Last</a>
        </li>
        <li>
          <a className="page-link" href="https://localhost">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </a>
        </li>
        <select
          className="form-control page-select page-link"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "80px", height: "35px"}}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </ul>
    </div>
  );
}

function PaginationMempoolTableComponent({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "AddLiquidity Transactions",
        columns: [
          {
            Header: "Block No",
            accessor: "blockNumber",
          },{
            Header: "Hash",
            accessor: "hash",
          },
          {
            Header: "From/Router Address",
            accessor: "from_to",
          },
          {
            Header: "Token(A/B)",
            accessor: "tokenA_B",
          },
          {
            Header: "AmountDesired(A/B)",
            accessor: "amountDesired_A_B",
          },
          {
            Header: "AmountMin(A/B)",
            accessor: "amountMin_A_B",
          },
          {
            Header: "AddressTo",
            accessor: "addressTo",
          },
          {
            Header: "DeadLine",
            accessor: "deadLine",
          },
        ],
      },
    ],
    []
  );

  return <MempoolTable columns={columns} data={data} />;
}

export default PaginationMempoolTableComponent;
