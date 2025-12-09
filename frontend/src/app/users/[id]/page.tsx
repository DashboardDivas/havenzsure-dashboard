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
  Tooltip,
  Snackbar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import { User, UpdateUserInput } from "@/types/user";
import { userApi } from "@/lib/api/userApi";
import { shopApi } from "@/lib/api/shopApi";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { formatPhone } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Shop {
  id: string;
  code: string;
  shopName: string;
  status: "active" | "inactive";
}

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
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
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning">("success");

  // ⬅ NEW STATES FOR ACTIVE SHOPS
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState<string | null>(null);

  // Snackbar helpers
  const showSuccess = (message: string) => {
    setSnackMessage(message);
    setSnackSeverity("success");
    setSnackOpen(true);
  };

  const showError = (message: string) => {
    setSnackMessage(message);
    setSnackSeverity("error");
    setSnackOpen(true);
  };

  // Fake upload function
  async function uploadUserAvatarFake(userId: string, file: File): Promise<string> {
    console.log("[DEV] Fake avatar upload", userId, file);
    return `https://havezsuredashboard.com/seed=${encodeURIComponent(userId)}`;
  }

  // Check if current user can edit the target user
  const canEditUser = (): boolean => {
    if (!currentUser || !user) return false;

    const currentRole = currentUser.roleCode;
    const targetRole = user.role?.code;

    // SuperAdmin can edit anyone
    if (currentRole === "superadmin") return true;

    // Admin can edit themselves (except role)
    if (currentRole === "admin" && currentUser.id === user.id) return true;

    // Admin can edit adjuster and bodyman
    if (currentRole === "admin" && (targetRole === "adjuster" || targetRole === "bodyman")) return true;

    // Admin cannot edit other admins or superadmins
    return false;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
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
        console.log("Failed to load user:", err);
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const getShops = async () => {
      try {
        setShopsLoading(true);
        const response = await shopApi.getShops(500, 0);

        const rawList = Array.isArray(response.data) ? response.data : [];

        const activeShops = rawList
          .filter((s: any) => s.status === "active")
          .map((s: any) => ({
            id: String(s.id),
            code: s.code,
            shopName: s.shopName,
            status: s.status,
          }));

        setShops(activeShops);
      } catch (err) {
        setShopsError("Failed to load shops");
      } finally {
        setShopsLoading(false);
      }
    };

    getShops();
  }, []);

  const handleEditOpen = () => {
    if (!user) return;

    // Check permission
    if (!canEditUser()) {
      setPermissionError("You don't have permission to edit this user");
      return;
    }

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

      const payload: UpdateUserInput = { ...editData };

      if (avatarFile) {
        const uploadedUrl = await uploadUserAvatarFake(user.id, avatarFile);
        payload.imageUrl = uploadedUrl;
      }

      const updated = await userApi.update(user.id, payload);
      setUser(updated);
      setOpenEdit(false);
      showSuccess("User updated successfully!");
    } catch (err: any) {
      console.log("Failed to save user changes:", err);
      showError("Failed to save changes");
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
        showSuccess("User deactivated successfully!");
      } else {
        await userApi.reactivate(user.id);
        showSuccess("User reactivated successfully!");
      }
      const refreshed = await userApi.getById(user.id);
      setUser(refreshed);
    } catch (err: any) {
      console.log("Failed to toggle user status:", err);
      showError("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleResendPasswordLink = async () => {
    if (!user) return;

    try {
      setSendingEmail(true);
      await userApi.resendPasswordLink(user.id);
      showSuccess("Password setup email sent successfully!");
    } catch (err: any) {
      console.log("Failed to resend password link:", err);
      showError("Failed to send email");
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
      {/* Permission Error Alert */}
      {permissionError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setPermissionError(null)}
        >
          {permissionError}
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
        {/* Top row */}
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
              disabled={sendingEmail || !canEditUser()}
            >
              {sendingEmail ? "Sending..." : "Send Password Reset Link"}
            </AppButton>
            <Tooltip
              title={!canEditUser() ? "You don't have permission to edit this user" : ""}
            >
              <span>
                <AppButton
                  color="primary"
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditOpen}
                  disabled={!canEditUser()}
                >
                  Edit User
                </AppButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Details List */}
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
                  disabled={!canEditUser()}
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
            {/* Avatar */}
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
              onChange={(e) =>
                setEditData({ ...editData, phone: formatPhone(e.target.value) })
              }
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={editData.roleCode || ""}
              onChange={(e) =>
                setEditData({ ...editData, roleCode: e.target.value })
              }
              fullWidth
              disabled={
                currentUser?.roleCode === "admin" && currentUser?.id === user?.id
              }
              helperText={
                currentUser?.roleCode === "admin" && currentUser?.id === user?.id
                  ? "You cannot change your own role"
                  : currentUser?.roleCode !== "superadmin"
                    ? "Note: Only SuperAdmins can assign Admin or SuperAdmin roles"
                    : ""
              }
            >
              {/* SuperAdmin option - disabled for non-superadmin users */}
              <MenuItem
                value="superadmin"
                disabled={currentUser?.roleCode !== "superadmin"}
              >
                Super Administrator
                {currentUser?.roleCode !== "superadmin" && " (Restricted)"}
              </MenuItem>

              {/* Admin option - disabled for non-superadmin users */}
              <MenuItem
                value="admin"
                disabled={currentUser?.roleCode !== "superadmin"}
              >
                Administrator
                {currentUser?.roleCode !== "superadmin" && " (Restricted)"}
              </MenuItem>

              <MenuItem value="adjuster">Adjuster</MenuItem>
              <MenuItem value="bodyman">Bodyman</MenuItem>
            </TextField>

            <TextField
              select
              label="Shop Code"
              value={editData.shopCode || ""}
              onChange={(e) =>
                setEditData({ ...editData, shopCode: e.target.value })
              }
              fullWidth
              helperText={shopsError ? shopsError : ""}
              disabled={shopsLoading || currentUser?.roleCode !== "superadmin"}
            >

              {shops.map((shop) => (
                <MenuItem key={shop.id} value={shop.code}>
                  {shop.code} — {shop.shopName}
                </MenuItem>
              ))}
            </TextField>
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
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
