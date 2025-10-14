'use client';

import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomThemeProvider from '@/context/ThemeContext';
import AppTable, { Column } from '@/components/ui/Table'; // ✅ your reusable table

// Type for log entries
type LogEntry = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
};

// Columns for the table
const columns: Column<LogEntry>[] = [
  { id: 'timestamp', label: 'Timestamp', sortable: true },
  { id: 'user', label: 'User', sortable: true },
  { id: 'action', label: 'Action', sortable: true },
  { id: 'details', label: 'Details' },
];

function LogTabContent() {
  const theme = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof LogEntry>('timestamp');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Mock fetching logs
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs([
        {
          id: 1,
          timestamp: '2024-06-01 10:15',
          user: 'Alice',
          action: 'Created',
          details: 'Work order created',
        },
        {
          id: 2,
          timestamp: '2024-06-02 09:30',
          user: 'Bob',
          action: 'Updated',
          details: 'Changed status to In Progress',
        },
        {
          id: 3,
          timestamp: '2024-06-03 14:20',
          user: 'Charlie',
          action: 'Commented',
          details: 'Added note: "Waiting for parts"',
        },
        {
          id: 4,
          timestamp: '2024-06-04 11:00',
          user: 'Alice',
          action: 'Closed',
          details: 'Marked work order as completed',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSortChange = (id: keyof LogEntry) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);

    // Sort locally
    const sorted = [...logs].sort((a, b) => {
      const aValue = a[id];
      const bValue = b[id];
      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });
    setLogs(sorted);
  };

  return (
    <Box p={4}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[2],
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          Log
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <AppTable<LogEntry>
            columns={columns}
            data={logs}
            loading={loading}
            total={logs.length}
            page={page}
            rowsPerPage={rowsPerPage}
            orderBy={orderBy}
            order={order}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onSortChange={handleSortChange}
          />
        )}
      </Paper>
    </Box>
  );
}

// ✅ Wrap with theme provider
export default function LogTab() {
  return (
    <CustomThemeProvider>
      <LogTabContent />
    </CustomThemeProvider>
  );
}
