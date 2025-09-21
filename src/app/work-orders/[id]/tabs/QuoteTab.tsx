'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchRepairSummary } from '@/lib/fakeApi';

// Normalize mockDefectQuotes into grid rows
function toRows(summary: any) {
  const quotes = summary?.mockDefectQuotes ?? [];
  return Array.isArray(quotes)
    ? quotes.map((q: any) => ({
      id: q?.ID,
      image: q?.Image,
      size: q?.Size,
      mode: q?.Mode,
      estCharge: q?.['Est.Charge'],
    }))
    : [];
}

export default function QuoteTab() {
  const [rows, setRows] = useState<any[]>([]);

  const [top, setTop] = useState<Array<{ label: string; value: string }>>([
    { label: 'Repair Shop', value: '' },
    { label: 'Technician Name', value: '' },
    { label: 'Pre-Authorized Dispatch', value: '' },
  ]);

  useEffect(() => {
    // fetchRepairSummary returns sync data per fakeApi
    const summary = fetchRepairSummary();
    setTop([
      { label: 'Repair Shop', value: summary['Repair Shop'] },
      { label: 'Technician Name', value: summary['Technician Name'] },
      { label: 'Pre-Authorized Dispatch', value: summary['Pre-Authorized Dispatch'] },
    ]);
    setRows(toRows(summary));
  }, []);

  // Just use a simple array for mode options
  const modeOptions = Array.from(new Set(rows.map((r) => String(r.mode))).values());

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'image', headerName: 'Image', flex: 1, minWidth: 140 },
    { field: 'size', headerName: 'Size', flex: 0.8, minWidth: 120 },
    {
      field: 'mode',
      headerName: 'Mode',
      flex: 0.6,
      minWidth: 140,
      type: 'singleSelect',
      editable: true,
      valueOptions: modeOptions,
    },
    {
      field: 'estCharge',
      headerName: 'Est. Charge',
      flex: 0.6,
      minWidth: 120,
      valueFormatter: (p: any) => "$ " + p,
    },
  ];

  const processRowUpdate = (newRow: any, oldRow: any) => {
    if (newRow.id === oldRow.id) {
      setRows((prev) => prev.map((r) => (r.id === newRow.id ? { ...r, ...newRow } : r)));
    }
    return newRow;
  };

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-gray-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Repair Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {top.map((f) => (
            <div
              key={f.label}
              className="bg-white/80 border border-blue-200 rounded-xl p-3 hover:bg-blue-50 transition"
            >
              <div className="text-xs text-blue-700">{f.label}</div>
              <div className="text-sm font-medium text-blue-900 truncate">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl shadow">
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableColumnMenu
            disableRowSelectionOnClick
            editMode="cell"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) => console.error(err)}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
