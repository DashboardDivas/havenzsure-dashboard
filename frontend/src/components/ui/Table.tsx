"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  CircularProgress,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type Column<T> = {
  id: keyof T | string; // Allow both keys of T and custom strings like "actions"
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

interface AppTableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  total?: number;
  page: number;
  rowsPerPage: number;
  orderBy?: keyof T;
  order?: "asc" | "desc";
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onSortChange?: (id: keyof T) => void;
  onRowClick?: (row: T) => void;
}

export default function AppTable<T extends { id: number | string }>({
  columns,
  data,
  loading,
  total,
  page,
  rowsPerPage,
  orderBy,
  order,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onRowClick,
}: AppTableProps<T>) {
  const theme = useTheme();

  // Dynamic hover color based on theme primary
  const hoverBgColor = alpha(theme.palette.primary.main, 0.08);
  const shadowColor = alpha(theme.palette.primary.main, 0.2);

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.id)}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => onSortChange?.(col.id as keyof T)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    transition: "all 0.25s ease-in-out",
                    "&:hover": {
                      backgroundColor: onRowClick ? hoverBgColor : undefined,
                      borderLeft: onRowClick
                        ? `3px solid ${theme.palette.primary.main}`
                        : undefined,
                      transform: onRowClick ? "translateX(2px)" : "none",
                      boxShadow: onRowClick
                        ? `0 4px 12px ${shadowColor}`
                        : "none",
                    },
                    "&:active": {
                      transform: onRowClick ? "scale(0.98)" : "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.id)}>
                      {col.render ? (
                        col.render(row)
                      ) : (
                        String(row[col.id as keyof T]) // Default rendering
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total ?? data.length}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
