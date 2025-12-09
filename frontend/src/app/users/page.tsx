"use client";

import React, { useEffect, useState } from "react";
import { AddUserForm } from "@/components/ui/AddUserForm";
import {
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Fade,
  Alert,
  IconButton,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { User } from "@/types/user"; 
import { userApi } from "@/lib/api/userApi";  

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof User | undefined>("code");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // 🔄 Fetch users from real API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userApi.list(); 
      setUsers(data);
    } catch (err: any) {
      console.log("Failed to fetch users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🧠 Sorting Logic
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
      
      // Handle nested objects (role, shop)
      if (typeof valA === 'object' && typeof valB === 'object') {
        const strA = JSON.stringify(valA);
        const strB = JSON.stringify(valB);
        return (strA < strB ? -1 : 1) * (isAsc ? 1 : -1);
      }
      
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setUsers(sorted);
  };

  // 🎉 Handle user creation success
  const handleUserCreated = () => {
    setOpen(false);
    setSuccessMessage("User created successfully! Password setup email sent.");
    fetchUsers(); // Refresh list
    
    // Auto-hide success message
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const columns: Column<User>[] = [
    { id: "code", label: "User Code", sortable: true },
    {
      id: "firstName",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar 
            src={row.imageUrl} 
            alt={`${row.firstName} ${row.lastName}`}
          >
            {row.firstName[0]}{row.lastName[0]}
          </Avatar>
          <Typography variant="body2">
            {row.firstName} {row.lastName}
          </Typography>
        </Box>
      ),
    },
    { id: "email", label: "Email", sortable: true },
    { 
      id: "role", 
      label: "Role", 
      sortable: false,
      render: (row) => <Typography variant="body2">{row.role.name}</Typography>
    },
    { 
      id: "shop", 
      label: "Shop", 
      sortable: false,
      render: (row) => (
        <Typography variant="body2">
          {row.shop ? row.shop.name : "—"}
        </Typography>
      )
    },
    {
      id: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusChip status={row.isActive ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <Fade in timeout={400}>
      <Box p={3}>
        {/* Success Message */}
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            action={
              <IconButton
                size="small"
                onClick={() => setSuccessMessage(null)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={600}>
            User Management
          </Typography>
          <AppButton variant="contained" onClick={() => setOpen(true)}>
            + Add User
          </AppButton>
        </Stack>

        {/* Table */}
        <AppTable<User>
          columns={columns}
          data={users.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          loading={loading}
          total={users.length}
          page={page}
          rowsPerPage={rowsPerPage}
          orderBy={orderBy}
          order={order}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onSortChange={handleSortChange}
          onRowClick={(row) => {
            const element = document.body;
            element.style.transition = "opacity 0.3s ease";
            element.style.opacity = "0.3";
            setTimeout(() => {
              router.push(`/users/${row.id}`);
              element.style.opacity = "1";
            }, 300);
          }}
        />

        {/* Add User Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <AddUserForm onSuccess={handleUserCreated} />
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
}
