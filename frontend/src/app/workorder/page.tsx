"use client";

import React, { useEffect, useState } from "react";
import { WorkOrderForm } from "@/components/ui/AddWorkOrderForm";
import {
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ActionMenu from "@/components/ui/ActionMenu";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { WorkOrder, getWorkOrders } from "@/lib/api/workorderApi";
import type { StatusType } from "@/components/ui/StatusChip";

import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation"; // ✅ added router

// Status icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function WorkOrdersPage() {
  const theme = useTheme();
  const router = useRouter(); // ✅ initialize router

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof WorkOrder | undefined>(
    "work_order_id" as keyof WorkOrder
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    getWorkOrders() // ✅ replaced fakeApi.getWorkOrders() with real API
      .then((data) => {
        setWorkOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching work orders:", err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
      if (newFilter === "all") {
        setFilteredOrders(workOrders);
      } else {
        setFilteredOrders(workOrders.filter((wo) => wo.status === newFilter));
      }
      setPage(0);
    }
  };

  const columns: Column<WorkOrder & { id: string | number }>[] = [
    { id: "work_order_id", label: "Work Order ID", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status as StatusType} />,
    },
    { id: "date_received", label: "Date Received", sortable: true },
    { id: "date_updated", label: "Date Updated", sortable: true },
    {
      id: "customer",
      label: "Customer Name",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar alt={row.customer.full_name} />
          <Typography variant="body2">{row.customer.full_name}</Typography>
        </Box>
      ),
    },
    {
      id: "email",
      label: "Email",
      sortable: true,
      render: (row) => row.customer.email,
    },
  ];

  const handleSortChange = (id: "id" | keyof WorkOrder) => {
    const key: keyof WorkOrder =
      id === "id" ? ("work_order_id" as keyof WorkOrder) : id;
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);

    const sorted = [...filteredOrders].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB) * (isAsc ? 1 : -1);
      }
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setFilteredOrders(sorted);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Work Order Management
        </Typography>
        <AppButton variant="contained" onClick={() => setOpen(true)}>
          + Add Work Order
        </AppButton>
      </Grid>

      {/* Filter Bar */}
      <Box
        mb={3}
        sx={{
          borderRadius: 3,
          p: 1.5,
          backdropFilter: "blur(12px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.8)"
              : "rgba(30,30,30,0.6)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 4px 12px rgba(0,0,0,0.08)"
              : "0 4px 16px rgba(0,0,0,0.4)",
          border: `1px solid ${theme.palette.mode === "light"
              ? "rgba(0,0,0,0.08)"
              : "rgba(255,255,255,0.1)"
            }`,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={statusFilter}
          exclusive
          onChange={handleFilterChange}
          aria-label="work order status filter"
          size="small"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1.5,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              borderRadius: "12px",
              px: 2,
              py: 0.8,
              fontWeight: 500,
              fontSize: "0.85rem",
              transition: "all 0.25s ease-in-out",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 0.6,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[800],
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
                transform: "scale(1.05)",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "0 4px 12px rgba(0,0,0,0.6)",
                transform: "scale(1.05)",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            },
          }}
        >
          <ToggleButton value="all">
            <AssignmentIcon fontSize="small" /> All Status
          </ToggleButton>
          <ToggleButton value="waiting_for_inspection">
            <HourglassEmptyIcon fontSize="small" /> Waiting for Inspection
          </ToggleButton>
          <ToggleButton value="in_progress">
            <BuildCircleIcon fontSize="small" /> In Progress
          </ToggleButton>
          <ToggleButton value="follow_up_required">
            <ReplayCircleFilledIcon fontSize="small" /> Follow-up Required
          </ToggleButton>
          <ToggleButton value="completed">
            <CheckCircleIcon fontSize="small" /> Completed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table */}
      <AppTable<WorkOrder & { id: string | number }>
        columns={columns}
        data={filteredOrders
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) => ({ ...row, id: row.work_order_id }))}
        loading={loading}
        total={filteredOrders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSortChange={handleSortChange}
        onRowClick={(row) => router.push(`/workorder/${row.work_order_id}`)}
      />

      {/* Add Work Order Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Work Order</DialogTitle>
        <DialogContent>
          <WorkOrderForm />
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Box>
  );
}
