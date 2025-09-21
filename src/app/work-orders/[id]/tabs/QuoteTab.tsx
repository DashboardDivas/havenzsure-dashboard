'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchRepairSummary } from '@/lib/fakeApi';
import { DefectMode, DefectQuote, RepairSummary } from '@/types/defect';

type DataGridRow = {
  id: number;
  image: string;
  size: string;
  mode: DefectMode;
  estCharge: number;
};

function toRows(summary: RepairSummary): DataGridRow[] {
  return summary.defectQuotes.map((q: DefectQuote) => ({
    id: q.ID,
    image: q.Image,
    size: q.Size,
    mode: q.Mode,
    estCharge: q.EstCharge,
  }));
}

export default function QuoteTab() {
  const [rows, setRows] = useState<DataGridRow[]>([]);

  const [repairShop, setRepairShop] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [preAuthorizedDispatch, setPreAuthorizedDispatch] = useState('');

  useEffect(() => {
    const summary = fetchRepairSummary();
    setRepairShop(summary['Repair Shop']);
    setTechnicianName(summary['Technician Name']);
    setPreAuthorizedDispatch(summary['Pre-Authorized Dispatch']);
    setRows(toRows(summary));
  }, []);

  const modeOptions = [DefectMode.Fixed, DefectMode.Skip];

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
      valueFormatter: (p: number) => "$ " + p,
    },
  ];

  const processRowUpdate = (newRow: DataGridRow) => {
    const updatedRows = rows.map(function (oldRow) {
      if (oldRow.id === newRow.id) {
        return newRow;
      } else {
        return oldRow;
      }
    });
    setRows(updatedRows);
    return newRow;
  };

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-gray-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Repair Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div
            key={"Repair Shop"}
            className="bg-white/80 border border-blue-200 rounded-xl p-3 hover:bg-blue-50 transition"
          >
            <div className="text-xs text-blue-700">{"Repair Shop"}</div>
            <div className="text-sm font-medium text-blue-900 truncate">{repairShop}</div>
          </div>
          <div
            key={"Technician Name"}
            className="bg-white/80 border border-blue-200 rounded-xl p-3 hover:bg-blue-50 transition"
          >
            <div className="text-xs text-blue-700">{"Technician Name"}</div>
            <div className="text-sm font-medium text-blue-900 truncate">{technicianName}</div>
          </div>
          <div
            key={"Pre-Authorized Dispatch"}
            className="bg-white/80 border border-blue-200 rounded-xl p-3 hover:bg-blue-50 transition"
          >
            <div className="text-xs text-blue-700">{"Pre-Authorized Dispatch"}</div>
            <div className="text-sm font-medium text-blue-900 truncate">{preAuthorizedDispatch}</div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl shadow">
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            editMode="cell"
            processRowUpdate={processRowUpdate}
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
