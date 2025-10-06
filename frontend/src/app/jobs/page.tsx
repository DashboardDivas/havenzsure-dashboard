"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { fakeApi, Job } from "@/lib/fakeApi"; 
import { AddJobForm } from "@/components/ui/AddJobForm";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Job | undefined>("id" as keyof Job);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Dialog state
  const [open, setOpen] = useState(false);

  // Fetch mock data
  useEffect(() => {
    setLoading(true);
    fakeApi.getJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  // Table Columns
  const columns: Column<Job>[] = [
    { id: "id", label: "Job ID", sortable: true },
    {
      id: "title",
      label: "Job Title",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={row.image} alt={row.title} />
          <Typography variant="body2">{row.title}</Typography>
        </Box>
      ),
    },
    { id: "customer", label: "Customer", sortable: true },
    { id: "assignedTo", label: "Assigned To", sortable: true },
    { id: "repairShop", label: "Repair Shop", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
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

  // Sorting Logic
  const handleSortChange = (id: keyof Job) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...jobs].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setJobs(sorted);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Job Management
        </Typography>
        <AppButton variant="contained" onClick={() => setOpen(true)}>
          + Add Job
        </AppButton>
      </Grid>

      {/* Table */}
      <AppTable<Job>
        columns={columns}
        data={jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        loading={loading}
        total={jobs.length}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSortChange={handleSortChange}
      />

      {/* Add Job Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Job</DialogTitle>
        <DialogContent>
          <AddJobForm />
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Box>
  );
}
