'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import {
  fetchRepairSummary,
  RepairSummary,
  DataGridRow,
  toDataGridRows,
} from '@/lib/fakeApi';
import AppTable from '@/components/ui/Table';
import CustomThemeProvider from '@/context/ThemeContext'; 

function QuoteTabContent() {
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const [repairShop, setRepairShop] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [preAuthorizedDispatch, setPreAuthorizedDispatch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const summary: RepairSummary = fetchRepairSummary();
    setRepairShop(summary['Repair Shop']);
    setTechnicianName(summary['Technician Name']);
    setPreAuthorizedDispatch(summary['Pre-Authorized Dispatch']);
    setRows(toDataGridRows(summary.defectQuotes)); // ✅ use your helper directly
    setLoading(false);
  }, []);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'image', label: 'Image' },
    { id: 'size', label: 'Size' },
    {
      id: 'mode',
      label: 'Mode',
      sortable: true,
      render: (row: DataGridRow) => row.mode,
    },
    {
      id: 'estCharge',
      label: 'Est. Charge',
      sortable: true,
      render: (row: DataGridRow) => `$${row.estCharge.toFixed(2)}`,
    },
  ];

  return (
    <Box p={4}>
      <Paper sx={{ p: 4, backgroundColor: 'background.default', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Repair Summary
        </Typography>

        {/* --- Info boxes --- */}
        <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={3} mb={4}>
          <InfoBox label="Repair Shop" value={repairShop} />
          <InfoBox label="Technician Name" value={technicianName} />
          <InfoBox label="Pre-Authorized Dispatch" value={preAuthorizedDispatch} />
        </Box>

        {/* --- Table or Loader --- */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <AppTable
            columns={columns}
            data={rows}
            loading={loading}
            total={rows.length}
            page={0}
            rowsPerPage={10}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        )}
      </Paper>
    </Box>
  );
}

// ✅ Reusable info box
function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <Box p={3} bgcolor="background.paper" borderRadius={2} boxShadow={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
}

// ✅ Final export with theme provider
export default function QuoteTab() {
  return (
    <CustomThemeProvider>
      <QuoteTabContent />
    </CustomThemeProvider>
  );
}
