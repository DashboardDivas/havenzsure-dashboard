"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fakeApi, User } from "@/lib/fakeApi";
import { AppButton } from "@/components/ui/Buttons";

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧱 Edit state
  const [openEdit, setOpenEdit] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await fakeApi.getUsers();
      if (!mounted) return;
      const found = data.find((u) => String(u.id) === String(id));
      setUser(found || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEditOpen = () => {
    if (!user) return;
    setEditedUser({ ...user });
    setOpenEdit(true);
  };

  const handleEditChange = (field: keyof User, value: string) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSave = async () => {
    if (!editedUser) return;
    try {
      setLoading(true);
      const updated = await fakeApi.updateUser(editedUser);
      setUser(updated);
      setEditedUser(updated);
      setOpenEdit(false);
      console.log("✅ User updated globally:", updated);
    } catch (err) {
      console.log("❌ Failed to update user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error" mb={2}>
          User not found.
        </Typography>
        <AppButton onClick={() => router.push("/users")}>Go Back</AppButton>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => router.push("/users")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          User Profile
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}>
        {/* Top row: avatar + info + actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 90, height: 90 }} />
            <Box minWidth={0}>
              <Typography variant="h6" noWrap>
                {user.name}
              </Typography>
              <Typography color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <Chip
                label={user.status}
                color={user.status === "active" ? "success" : "default"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <AppButton variant="outlined">Message</AppButton>
            <AppButton color="primary" variant="contained" onClick={handleEditOpen}>
              Edit User
            </AppButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Details */}
        <List disablePadding>
          <ListItem>
            <ListItemText primary="User ID" secondary={String(user.id)} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Role" secondary={user.role} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Repair Shop" secondary={user.repairShop || "—"} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Status" secondary={user.status} />
          </ListItem>
        </List>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editedUser && (
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={editedUser.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={editedUser.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Role"
                value={editedUser.role}
                onChange={(e) => handleEditChange("role", e.target.value)}
                fullWidth
              />
              <TextField
                label="Repair Shop"
                value={editedUser.repairShop}
                onChange={(e) => handleEditChange("repairShop", e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={editedUser.status}
                onChange={(e) => handleEditChange("status", e.target.value)}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <AppButton variant="outlined" onClick={() => setOpenEdit(false)}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
