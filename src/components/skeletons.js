import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const TableRowSkeleton = function(props) {
  const rows = [];
  const rowCount = props.rowCount || 5;
  for (let index = 0; index < rowCount; index++) {
    rows.push(
      <TableRow>
        <TableCell>
          <Skeleton variant="rect" width={200} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rect" width={200} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rect" width={200} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rect" width={200} height={20} />
        </TableCell>
      </TableRow>
    );
  }
  return <React.Fragment>
      {rows}
  </React.Fragment>;
};


const ButtonSkeleton = function (props) {
  return <Skeleton variant="rect" width={"100%"} height={50} />
}
export { TableRowSkeleton, ButtonSkeleton };
