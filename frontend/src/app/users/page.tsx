"use client";

import React, { useEffect, useState } from "react";
import { AddUserForm } from "@/components/ui/AddUserForm";
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
import { fakeApi, User } from "@/lib/fakeApi";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof User | undefined>("id" as keyof User);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Dialog state
  const [open, setOpen] = useState(false);

  // Fetch mock data
  useEffect(() => {
    setLoading(true);
    fakeApi.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  // Table Columns
  const columns: Column<User>[] = [
    { id: "id", label: "User ID", sortable: true },
    {
      id: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={row.avatar} alt={row.name} />
          <Typography variant="body2">{row.name}</Typography>
        </Box>
      ),
    },
    { id: "email", label: "Email", sortable: true },
    { id: "role", label: "Role", sortable: true },
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
  const handleSortChange = (id: keyof User) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...users].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setUsers(sorted);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          User Management
        </Typography>
        <AppButton variant="contained" onClick={() => setOpen(true)}>
          + Add User
        </AppButton>
      </Grid>

      {/* Table */}
      <AppTable<User>
        columns={columns}
        data={users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
        loading={loading}
        total={users.length}
        page={page}
        rowsPerPage={rowsPerPage}
        orderBy={orderBy}
        order={order}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onSortChange={handleSortChange}
      />

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {/* Placeholder for AddUserForm */}
          <AddUserForm />
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Box>
  );
}
