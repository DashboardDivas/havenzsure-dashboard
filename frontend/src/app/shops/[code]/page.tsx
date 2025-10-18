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
import { shopApi, Shop } from "@/lib/api/shopApi";
import { AppButton } from "@/components/ui/Buttons";

export default function ShopDetailPage() {
  const { code } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editedShop, setEditedShop] = useState<Shop | null>(null);

  // Fetch shop details
  useEffect(() => {
    if (!code) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await shopApi.getShops();

      if (!mounted) return;
      const found = data.find((s) => s.code === String(code));
      setShop(found || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [code]);

  // Open edit dialog
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
     if (!editedShop || !shop) return;
    try {
      setLoading(true);
      //update shop with original shop code
      const updated = await shopApi.updateShop(shop.code, editedShop);

      setShop(updated);
      setEditedShop(updated);
      setOpenEdit(false);

      console.log("✅ Shop updated globally:", updated);

      if (updated.code !== shop.code) {
      router.push(`/shops/${updated.code}`);
    }
    } catch (err) {
      console.error("❌ Failed to update shop:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }

  // Shop not found
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

  // ✅ Main content
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

      {/* Main Card */}
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
              {shop.shopName}
            </Typography>
            <Typography color="text.secondary" noWrap>
              Contact: {shop.contactName}
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
            <ListItemText primary="Shop Code" secondary={shop.code} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Address" secondary={shop.address} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="City" secondary={shop.city} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Province" secondary={shop.province} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Postal Code" secondary={shop.postalCode} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Phone" secondary={shop.phone} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText primary="Email" secondary={shop.email} />
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText
              primary="Created At"
              secondary={shop.createdAt ? new Date(shop.createdAt).toLocaleString() : "—"}
            />
          </ListItem>
        </List>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Shop Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editedShop && (
            <Stack spacing={2} mt={5}>
              <TextField
                label="Shop Code"
                value={editedShop.code}
                onChange={(e) => handleEditChange("code", e.target.value)}
                fullWidth
              />
              <TextField
                label="Shop Name"
                value={editedShop.shopName}
                onChange={(e) => handleEditChange("shopName", e.target.value)}
                fullWidth
              />
              <TextField
                label="Contact Name"
                value={editedShop.contactName}
                onChange={(e) => handleEditChange("contactName", e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={editedShop.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={editedShop.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                fullWidth
              />
              <TextField
                label="Address"
                value={editedShop.address}
                onChange={(e) => handleEditChange("address", e.target.value)}
                fullWidth
              />
              <TextField
                label="City"
                value={editedShop.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="Province"
                value={editedShop.province}
                onChange={(e) => handleEditChange("province", e.target.value)}
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
