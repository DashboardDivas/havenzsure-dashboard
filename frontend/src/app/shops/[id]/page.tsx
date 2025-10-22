"use client";

import React, { useEffect, useState, useMemo } from "react";
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

// --- Regex validators ---
const regex = {
  province: /^[A-Z]{2}$/,
  postalCode: /^[A-Z]\d[A-Z]\d[A-Z]\d$/,
  phone: /^\d{3}-\d{3}-\d{4}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
};

// --- Field validation function ---
const validateField = (field: keyof Shop, value: string): string => {
  const v = value.trim();
  switch (field) {
    case "code":
      if (!v) return "Required";
      if (v.length < 2 || v.length > 10) return "Must be 2–10 characters";
      break;
    case "province":
      if (!v) return "Required";
      if (!regex.province.test(v.toUpperCase())) return "Invalid province code (e.g. AB)";
      break;
    case "postalCode":
      if (!v) return "Required";
      if (!regex.postalCode.test(v.toUpperCase())) return "Format: A1A1A1";
      break;
    case "phone":
      if (!v) return "Required";
      if (!regex.phone.test(v)) return "Format: 403-555-1234";
      break;
    case "email":
      if (!v) return "Required";
      if (!regex.email.test(v)) return "Invalid email format. Try sample@gmail.com";
      break;
    default:
      if (!v) return "Required";
  }
  return "";
};

export default function ShopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editedShop, setEditedShop] = useState<Shop | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Shop, string>>>({});

  // Fetch shop details
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      const data = await shopApi.getShops();

      if (!mounted) return;
      const found = data.find((s) => s.code === String(id));
      setShop(found || null);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Open edit dialog
  const handleEditOpen = () => {
    if (!shop) return;
    setEditedShop({ ...shop });
    // Validate all fields initially
    const initialErrors: Partial<Record<keyof Shop, string>> = {};
    (Object.keys(shop) as (keyof Shop)[]).forEach((field) => {
      if (typeof shop[field] === "string") {
        initialErrors[field] = validateField(field, shop[field] as string);
      }
    });
    setErrors(initialErrors);
    setOpenEdit(true);
  };

  const handleEditChange = (field: keyof Shop, value: string) => {
    if (!editedShop) return;
    setEditedShop({ ...editedShop, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const isFormValid = useMemo(() => {
    if (!editedShop) return false;
    return Object.entries(editedShop).every(([k, v]) => {
      if (typeof v === "string") {
        return validateField(k as keyof Shop, v) === "";
      }
      return true;
    });
  }, [editedShop]);

  const handleSave = async () => {
    if (!editedShop || !isFormValid) return;
    try {
      setLoading(true);

      const updated = await shopApi.updateShop(editedShop.code, editedShop);

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
            <Stack spacing={2}>
              {(
                [
                  "shopName",
                  "contactName",
                  "phone",
                  "email",
                  "address",
                  "city",
                  "province",
                  "postalCode",
                ] as (keyof Shop)[]
              ).map((field) => (
                <TextField
                  key={field}
                  label={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  value={editedShop[field] || ""}
                  onChange={(e) => handleEditChange(field, e.target.value)}
                  fullWidth
                  required
                  error={!!errors[field]}
                  helperText={errors[field]}
                  inputProps={
                    field === "province" || field === "postalCode"
                      ? { style: { textTransform: "uppercase" } }
                      : undefined
                  }
                />
              ))}
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
          <AppButton
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save Changes
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
