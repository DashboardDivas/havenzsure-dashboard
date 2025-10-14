"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
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
import { fakeApi, Shop } from "@/lib/fakeApi";
import { AppButton } from "@/components/ui/Buttons";

export default function ShopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧱 Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editedShop, setEditedShop] = useState<Shop | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await fakeApi.getShops();
      if (!mounted) return;

      // Match route param "001" to API ID "#001"
      const found = data.find((s) => s.id.replace("#", "") === String(id));

      setShop(found || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEditOpen = () => {
    if (!shop) return;
    setEditedShop({ ...shop });
    setOpenEdit(true);
  };

  const handleEditChange = (field: keyof Shop, value: string) => {
    if (!editedShop) return;
    setEditedShop({ ...editedShop, [field]: value });
  };

  const handleSave = async () => {
  if (!editedShop) return;
  try {
    setLoading(true);

    // Persist the update to the fake API
    const updated = await fakeApi.updateShop(editedShop);

    // Update UI with saved data
    setShop(updated);
    setEditedShop(updated);
    setOpenEdit(false);

    console.log("✅ Shop updated globally:", updated);
  } catch (err) {
    console.error("❌ Failed to update shop:", err);
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

  if (!shop) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error" mb={2}>
          Shop not found.
        </Typography>
        <AppButton onClick={() => router.push("/shops")}>Go Back</AppButton>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => router.push("/shops")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Shop Details
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}>
        {/* Top Row: Shop Name + Status + Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="h6" noWrap>
              {shop.name}
            </Typography>
            <Typography color="text.secondary" noWrap>
              Owned by: {shop.owner}
            </Typography>
            <Chip
              label={shop.status}
              color={shop.status === "active" ? "success" : "default"}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <AppButton variant="outlined" onClick={() => {}}>
              Contact
            </AppButton>
            <AppButton color="primary" variant="contained" onClick={handleEditOpen}>
              Edit Shop
            </AppButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Shop Info */}
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Shop ID" secondary={shop.id} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Owner" secondary={shop.owner} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Email" secondary={shop.email} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Contact" secondary={shop.contact} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Address" secondary={shop.address} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Postal Code" secondary={shop.postalCode} />
          </ListItem>
        </List>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Shop Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editedShop && (
            <Stack spacing={2}>
              <TextField
                label="Shop Name"
                value={editedShop.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                fullWidth
              />
              <TextField
                label="Owner"
                value={editedShop.owner}
                onChange={(e) => handleEditChange("owner", e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={editedShop.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Contact"
                value={editedShop.contact}
                onChange={(e) => handleEditChange("contact", e.target.value)}
                fullWidth
              />
              <TextField
                label="Address"
                value={editedShop.address}
                onChange={(e) => handleEditChange("address", e.target.value)}
                fullWidth
              />
              <TextField
                label="Postal Code"
                value={editedShop.postalCode}
                onChange={(e) => handleEditChange("postalCode", e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={editedShop.status}
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
