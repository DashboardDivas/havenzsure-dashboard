"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";


import AppTable, { Column } from "@/components/ui/Table";
import StatusChip from "@/components/ui/StatusChip";
import { fakeApi, WorkOrder } from "@/lib/fakeApi";

export default function JobsPage() {
  const theme = useTheme();
  const router = useRouter();

  const [completedJobs, setCompletedJobs] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof WorkOrder | undefined>(
    "id" as keyof WorkOrder
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);

  // Fetch and filter only completed work orders
  useEffect(() => {
    setLoading(true);
    fakeApi.getWorkOrders().then((data) => {
      const completed = data.filter((wo) => wo.status === "completed");
      setCompletedJobs(completed);
      setLoading(false);
    });
  }, []);

  const columns: Column<WorkOrder>[] = [
    { id: "id", label: "Job ID", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    { id: "dateReceived", label: "Date Received", sortable: true },
    { id: "dateUpdated", label: "Date Completed", sortable: true },
    {
      id: "customer",
      label: "Customer Name",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={row.customerAvatar} alt={row.customer} />
          <Typography variant="body2">{row.customer}</Typography>
        </Box>
      ),
    },
    { id: "email", label: "Email", sortable: true },
    {
      id: "actions",
      label: "Actions",
      render: () => (
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleSortChange = (id: keyof WorkOrder) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...completedJobs].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setCompletedJobs(sorted);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Completed Jobs
        </Typography>
      </Grid>

      {/* Table */}
      <AppTable<WorkOrder>
        columns={columns}
        data={completedJobs.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )}
        loading={loading}
        total={completedJobs.length}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSortChange={handleSortChange}
        onRowClick={(row) => router.push(`/workorder/${row.id}`)} 
      />
    </Box>
  );
}
