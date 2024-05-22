import React from "react";

import { useTable, usePagination } from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import "bootstrap/dist/css/bootstrap.min.css";

function ResultTable({ columns, data }) {
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
    table: {
      fontSize: 18,
      color : 'red'
    },
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
      <table className="table" {...getTableProps()}>
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
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
      <ul className="pagination" style={{ fontSize: 16 }}>
        <li
          className="page-item"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <a className="page-link">First</a>
        </li>
        <li
          className="page-item"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <a className="page-link">{"<"}</a>
        </li>
        <li className="page-item">
          <a className="page-link">{pageIndex + 1}</a>
        </li>
        <li
          className="page-item"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <a className="page-link">{">"}</a>
        </li>
        <li
          className="page-item"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <a className="page-link">Last</a>
        </li>
        <li>
          <a className="page-link">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </a>
        </li>
        {/* <li>
          <a className="page-link">
            <input
              className="form-control"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px', height: '20px' }}
            />
          </a>
        </li>{' '} */}
        <select
          className="form-control page-select page-link"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "80px", height: "35px" }}
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

function PaginationTableComponent({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Buy/Sell Information",
        columns: [
          {
            Header: "Block No",
            accessor: "blockNumber"
          },{
            Header: "Hash",
            accessor: "hash",
          },
          {
            Header: "Token0",
            accessor: "token0",
          },
          {
            Header: "Token1",
            accessor: "token1",
          },
          {
            Header: "In",
            accessor: "in",
          },
          {
            Header: "Out",
            accessor: "out",
          }
        ],
      },
    ],
    []
  );

  // const data = [
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   },
  //   {
  //     "sender": "committee-c15dw",
  //     "receiver": "editor-ktsjo",
  //     "contractAddress": 3,
  //     "symbol": 46,
  //     "amount": 75
  //   }]

  return <ResultTable columns={columns} data={data} />;
}

export default PaginationTableComponent;
