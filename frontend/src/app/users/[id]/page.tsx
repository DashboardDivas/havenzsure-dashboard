// Source note:
// This file was partially refactored with assistance from AI (ChatGPT).
// Edited and reviewed by AN-NI HUANG
// Date: 2025-11-23
"use client"

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
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
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import { User, UpdateUserInput } from "@/types/user";
import { userApi } from "@/lib/api/userApi";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState<UpdateUserInput>({});
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Fake upload function
  async function uploadUserAvatarFake(userId: string, file: File): Promise<string> {
    console.log("[DEV] Fake avatar upload", userId, file);
    // Just return a placeholder URL for now
    return `https://havezsuredashboard.com/seed=${encodeURIComponent(
      userId
    )}`;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // Local preview
  };

  // Fetch user data
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userApi.getById(id as string);
        setUser(data);
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleEditOpen = () => {
    if (!user) return;
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      imageUrl: user.imageUrl,
      roleCode: user.role.code,
      shopCode: user.shop?.code,
    });
    setAvatarPreview(user.imageUrl ?? null);
    setAvatarFile(null);
    setOpenEdit(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Prepare payload
      const payload: UpdateUserInput = { ...editData };

      // Handle avatar upload if a new file is selected
      if (avatarFile) {
        const uploadedUrl = await uploadUserAvatarFake(user.id, avatarFile);
        payload.imageUrl = uploadedUrl;
      }

      const updated = await userApi.update(user.id, payload);
      setUser(updated);
      setOpenEdit(false);
    } catch (err: any) {
      console.error("Failed to update user:", err);
      alert(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);
      if (user.isActive) {
        await userApi.deactivate(user.id);
      } else {
        await userApi.reactivate(user.id);
      }
      // Refresh user data
      const refreshed = await userApi.getById(user.id);
      setUser(refreshed);
    } catch (err: any) {
      console.error("Failed to toggle user status:", err);
      alert(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleResendPasswordLink = async () => {
    if (!user) return;

    try {
      setSendingEmail(true);
      await userApi.resendPasswordLink(user.id);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 5000);
    } catch (err: any) {
      console.error("Failed to resend password link:", err);
      alert(err.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error" mb={2}>
          {error || "User not found"}
        </Typography>
        <AppButton onClick={() => router.push("/users")}>Go Back</AppButton>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Success Alert */}
      {emailSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Password setup email sent successfully!
        </Alert>
      )}

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
            <Avatar
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ width: 90, height: 90 }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar>
            <Box minWidth={0}>
              <Typography variant="h6" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <StatusChip status={user.isActive ? "active" : "inactive"} />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <AppButton
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleResendPasswordLink}
              disabled={sendingEmail}
            >
              {sendingEmail ? "Sending..." : "Send Password Reset Link"}
            </AppButton>
            <AppButton
              color="primary"
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditOpen}
            >
              Edit User
            </AppButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Details */}
        <List disablePadding>
          <ListItem>
            <ListItemText primary="User Code" secondary={user.code} />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText primary="Phone" secondary={user.phone || "—"} />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText primary="Role" secondary={user.role.name} />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText primary="Shop" secondary={user.shop?.name || "—"} />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Email Verified"
              secondary={user.emailVerified ? "Yes" : "No"}
            />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Created At"
              secondary={new Date(user.createdAt).toLocaleString()}
            />
          </ListItem>
          <Divider component="li" />

          <ListItem>
            <ListItemText
              primary="Updated At"
              secondary={new Date(user.updatedAt).toLocaleString()}
            />
          </ListItem>
          <Divider component="li" />

          <ListItem alignItems="flex-start">
            <Box flexGrow={1}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <StatusChip status={user.isActive ? "active" : "inactive"} />
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={handleToggleStatus}
                >
                  {user.isActive ? "Deactivate" : "Reactivate"}
                </AppButton>
              </Box>
            </Box>
          </ListItem>
        </List>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {/* Avatar Upload Placeholder */}
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={avatarPreview || editData.imageUrl || user.imageUrl || undefined}
                sx={{ width: 64, height: 64 }}
              >
                {(editData.firstName || user.firstName)[0]}
                {(editData.lastName || user.lastName)[0]}
              </Avatar>
              <Box>
                <AppButton
                  variant="outlined"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Image
                </AppButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={0.5}
                >
                  For now, the image is updated as a URL only. File upload will be wired
                  to backend later.
                </Typography>
              </Box>
            </Box>

            <TextField
              label="First Name"
              value={editData.firstName || ""}
              onChange={(e) =>
                setEditData({ ...editData, firstName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Last Name"
              value={editData.lastName || ""}
              onChange={(e) =>
                setEditData({ ...editData, lastName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Phone (Format: 403-123-4567)"
              value={editData.phone || ""}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={editData.roleCode || ""}
              onChange={(e) => setEditData({ ...editData, roleCode: e.target.value })}
              fullWidth
            >
              <MenuItem value="superadmin">Super Administrator</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="adjuster">Adjuster</MenuItem>
              <MenuItem value="bodyman">Bodyman</MenuItem>
            </TextField>
            <TextField
              label="Shop Code (Optional)"
              value={editData.shopCode || ""}
              onChange={(e) => setEditData({ ...editData, shopCode: e.target.value })}
              fullWidth
              helperText="Leave empty if user is not assigned to a shop"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <AppButton variant="outlined" onClick={() => setOpenEdit(false)}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
