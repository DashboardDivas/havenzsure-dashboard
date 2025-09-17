"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { fetchWorkOrders } from "@/lib/fakeApi";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { useRouter } from "next/navigation";
import StatusChip from "@/components/ui/StatusChip";
import Button from "@/components/ui/PrimaryButton";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function WorkOrdersGrid() {
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    setRows(fetchWorkOrders());
  }, []);

  const columns: GridColDef[] = [
    { field: "WorkOrderID", headerName: "WorkOrder ID", width: 120 },
    {
      field: "Status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
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

  const [activeTab, setActiveTab] = useState<WorkOrderStatus | "ALL">("ALL");
  const statusTabs: (WorkOrderStatus | "ALL")[] = [
    "ALL",
    WorkOrderStatus.WaitingForInspection,
    WorkOrderStatus.InProgress,
    WorkOrderStatus.FollowUpRequired,
    WorkOrderStatus.Completed,
    WorkOrderStatus.WaitingForInformation,
  ];

  const filteredRows: WorkOrder[] =
    activeTab === "ALL" ? rows : rows.filter((row) => row.Status === activeTab);

  // 🆕 Form modal state
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    bodyStyle: "",
    vin: "",
    year: "",
    color: "",
    damageDate: "",
    plateNumber: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    setRows((prev) => [
      ...prev,
      {
        WorkOrderID: (prev.length + 1).toString(),
        Status: WorkOrderStatus.WaitingForInspection,
        DateReceived: new Date().toISOString().split("T")[0],
        DateUpdate: new Date().toISOString().split("T")[0],
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        VIN: formData.vin,
      } as WorkOrder,
    ]);

    setOpenForm(false);
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      make: "",
      model: "",
      bodyStyle: "",
      vin: "",
      year: "",
      color: "",
      damageDate: "",
      plateNumber: "",
    });
  };

  return (
    <div>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: 30 }}>
          {statusTabs.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              style={{
                padding: "8px 16px",
                borderBottom:
                  activeTab === status
                    ? "2px solid #1976d2"
                    : "2px solid transparent",
                color: activeTab === status ? "#1976d2" : "#333",
                fontWeight: activeTab === status ? "bold" : "normal",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Open modal */}
        <Button onClick={() => setOpenForm(true)}>+ New Work Order</Button>
      </div>

      {/* Data Grid */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredRows.map((row: WorkOrder) => ({
            ...row,
            id: row.WorkOrderID,
          }))}
          columns={columns.map((col) => ({
            ...col,
            disableColumnMenu: true,
          }))}
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
          rowHeight={50}
        />
      </div>

      {/* Work Order Form Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
        <DialogTitle>Create New Work Order</DialogTitle>
        <DialogContent className="space-y-4">
          {/* Row 1: First + Last Name */}
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Row 2: Address */}
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            required
          />

          {/* Row 3: City, State, ZIP */}
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="ZIP"
              name="zip"
              value={formData.zip}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Row 4: Phone + Email */}
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="E-mail"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Vehicle Info */}
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              fullWidth
              label="Make"
              name="make"
              value={formData.make}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Body Style"
              name="bodyStyle"
              value={formData.bodyStyle}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* VIN */}
          <TextField
            fullWidth
            label="VIN #"
            name="vin"
            value={formData.vin}
            onChange={handleFormChange}
            required
          />

          {/* Year + Color */}
          <div style={{ display: "flex", gap: 16 }}>
            <TextField
              fullWidth
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Damage Date + Plate Number */}
          <div style={{ display: "flex", gap: 16 }}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="damageDate">
                Damage Date
              </InputLabel>
              <TextField
                id="damageDate"
                type="date"
                name="damageDate"
                value={formData.damageDate}
                onChange={handleFormChange}
                required
              />
            </FormControl>
            <TextField
              fullWidth
              label="Plate Number"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleFormChange}
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
