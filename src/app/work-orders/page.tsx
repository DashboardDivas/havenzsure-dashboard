"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { fetchWorkOrders } from "@/lib/fakeApi";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { useRef } from "react";
import { GridApi } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";

export default function WorkOrdersGrid() {
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const apiRef = useGridApiRef();
  const router = useRouter();

  useEffect(() => {
    fetchWorkOrders().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "WorkOrderID", headerName: "WorkOrder ID", width: 120 },
    { field: "Status", headerName: "Status", width: 130 },
    { field: "DateReceived", headerName: "Date Received", width: 180 },
    { field: "DateUpdate", headerName: "Date Update", width: 180 },
    { field: "FirstName", headerName: "First Name", width: 150 },
    { field: "LastName", headerName: "Last Name", width: 150 },
    { field: "Email", headerName: "Email", width: 200 },
    { field: "Phone", headerName: "Phone", width: 150 },
    { field: "VIN", headerName: "VIN", width: 180 },
  ];
  

  const [activeTab, setActiveTab] = useState<WorkOrderStatus | "ALL">("ALL");
  const statusTabs: (WorkOrderStatus | "ALL")[] = [
    "ALL",
    WorkOrderStatus.WaitingForInspection,
    WorkOrderStatus.InProgress,
    WorkOrderStatus.FollowUpRequired,
    WorkOrderStatus.Completed,
    WorkOrderStatus.WaitingForInformation,
  ];

  const filteredRows =
    activeTab === "ALL"
      ? rows
      : rows.filter((row) => row.Status === activeTab);

  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === status ? "2px solid #1976d2" : "2px solid transparent",
              background: "none",
              color: activeTab === status ? "#1976d2" : "#333",
              fontWeight: activeTab === status ? "bold" : "normal",
              cursor: "pointer",
              outline: "none",
              fontSize: 16,
            }}
          >
            {status === "ALL" ? "All" : status}
          </button>
        ))}
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredRows.map((row: WorkOrder) => ({
            ...row,
            id: row.WorkOrderID,
          }))}
          columns={columns.map((col) => {
            // 需要加filter图标的列
            const filterableFields = [
              "DateReceived",
              "DateUpdate",
              "FirstName",
              "LastName",
              "Email",
            ];
            if (filterableFields.includes(col.field)) {
              return {
                ...col,
                filterable: true,
                renderHeader: (params) => (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {col.headerName}
                    <span style={{ display: "inline-flex" }}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          apiRef.current?.showFilterPanel?.(col.field);
                        }}
                      >
                        <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A2 2 0 0 0 13 14.586V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-3.414a2 2 0 0 0-.293-1.121L2.293 6.707A1 1 0 0 1 2 6V4z" />
                      </svg>
                    </span>
                  </span>
                ),
                disableColumnMenu: true,
              };
            }
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