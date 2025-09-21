'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';


type LogEntry = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: 'Timestamp', width: 180 },
  { field: 'user', headerName: 'User', width: 140 },
  { field: 'action', headerName: 'Action', width: 160 },
  { field: 'details', headerName: 'Details', width: 300 },
];

export default function LogTab() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
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
      ]);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-blue-100 text-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Log</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow" style={{ height: 350, width: '100%' }}>
          <DataGrid
            rows={logs}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
          />
        </div>
      </div>
    </div>
  );
}