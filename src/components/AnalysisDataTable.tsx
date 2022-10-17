import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import {Table,
        TableBody,
        TableCell,
        TableHead,
        TableRow,
        Typography,
        Button} from "@mui/material";

import { createStyles, makeStyles, Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      border: `1px solid ${theme.palette.primary.main}80`,
      color: theme.palette.primary.main,
      padding: "0.3em",
      borderRadius: "5px"
    }
  })
);

interface AnalysisDataTableProps {
  data: any[];
  columns: any[];
}

export default function AnalysisDataTable({
  data,
  columns
}: AnalysisDataTableProps) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    pageCount,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 20
      }
    },
    useSortBy,
    usePagination
  );

  const classes = useStyles();

  return (
    <>
      <Table size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={`tablerow_${headerGroup.id}`}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps()) } key={`tablecell_${column.id}`}
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={`row_${row.id}`}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()} key={`cell_${cell.getCellProps().key}`}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <br />
      <div className="pagination">
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </Button>{" "}
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </Button>{" "}
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </Button>{" "}
        <Button
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </Button>{" "}
        <Typography component="span">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
          | Go to page:{" "}
          <input
            className={classes.select}
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </Typography>{" "}
        <select
          className={classes.select}
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
