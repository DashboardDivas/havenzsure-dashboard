"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { fetchWorkOrders } from "@/lib/fakeApi";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { useRouter } from "next/navigation";
import StatusChip from "@/components/ui/StatusChip";

export default function HistoryGrid() {
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWorkOrders().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

const columns: GridColDef[] = [
  { field: "WorkOrderID", headerName: "WorkOrder ID", width: 120 },
    {
      field: "Status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
          <StatusChip status={params.value} />
        </div>
      ),
    },
  { field: "DateReceived", headerName: "Date Received", width: 180 },
  { field: "DateUpdate", headerName: "Date Update", width: 180 },
  { field: "FirstName", headerName: "First Name", width: 150 },
  { field: "LastName", headerName: "Last Name", width: 150 },
  { field: "Email", headerName: "Email", width: 200 },
  { field: "Phone", headerName: "Phone", width: 150 },
  { field: "VIN", headerName: "VIN", width: 180 },
];


  const filteredRows = rows.filter((row) => row.Status === WorkOrderStatus.Completed);

  return (
    <div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredRows.map((row: WorkOrder) => ({
            ...row,
            id: row.WorkOrderID,
          }))}
          columns={columns.map((col) => {
            return { ...col, disableColumnMenu: true };
          })}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          onRowClick={(params) => {
            router.push(`/work-orders/${params.row.WorkOrderID}`);
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}