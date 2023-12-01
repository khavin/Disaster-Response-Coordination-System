import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";

export default function DataTable({ columns, tableData, tab }) {
  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = React.useState(tableData.slice(0, 10));

  React.useEffect(() => {
    setData(tableData.slice(0, 10));
    setPage(0);
  }, [tableData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setData(
      tableData.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newRowsPerPage = event.target.value;
    setRowsPerPage(+event.target.value);
    setPage(0);
    setData(tableData.slice(0, newRowsPerPage));
  };

  let header = [];
  for (let i = 0; i < columns.length; i++) {
    header.push(<TableCell key={columns[i]}>{columns[i]}</TableCell>);
  }

  let body = [];
  for (let i = 0; i < data.length; i++) {
    let cells = [];
    for (let j = 0; j < data[i].length; j++) {
      cells.push(
        <TableCell key={tab + "-" + data[i][j] + "-" + j}>
          {data[i][j]}
        </TableCell>
      );
    }
    body.push(
      <TableRow
        onClick={(e) => {
          navigate("/incidentInfo", {
            state: {
              incId: data[i][0],
              city: data[i][1],
              state: "VA",
            },
          });
        }}
        key={tab + "-" + data[i][0]}
      >
        {cells}
      </TableRow>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="tableHeader">
            <TableRow>{header}</TableRow>
          </TableHead>
          <TableBody>{body}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
