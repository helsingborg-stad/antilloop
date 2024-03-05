import React, { FC } from "react";

import TableContainer from "@mui/material/TableContainer";
import { Table as MuiTable } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import TablePagination from "@/components/workspace/TablePagination";

import { Meta } from "@/types/school";

interface TableProps {
  tableName: string;
  columns: { label: string; className?: string }[];
  children: React.ReactNode;
  nextPage: () => void;
  prevPage: () => void;
  meta?: Meta;
}

const Table: FC<TableProps> = ({
  tableName,
  columns,
  children,
  nextPage,
  prevPage,
  meta
}) => {
  return (
    <TableContainer className="no-scrollbar">
      <MuiTable stickyHeader aria-label={tableName}>
        <caption className="hidden">{tableName}</caption>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                scope="col"
                className={column.className}
                key={index}
                align="left"
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </MuiTable>
      <TablePagination
        a11yLabel={tableName}
        meta={meta}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </TableContainer>
  );
};

export default Table;
