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
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { shopApi, Shop, ApiResponse } from "@/lib/api/shopApi";
import { AppButton } from "@/components/ui/Buttons";

export default function ShopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editedShop, setEditedShop] = useState<Shop | null>(null);

  // Code change confirmation state
  const [showCodeConfirm, setShowCodeConfirm] = useState(false);
  const [originalCode, setOriginalCode] = useState<string>("");
  const [pendingCodeChange, setPendingCodeChange] = useState<string>("");

  // Error notification state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning">("error");

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Helper function to show error messages
  const showError = (message: string) => {
    setSnackMessage(message);
    setSnackSeverity("error");
    setSnackOpen(true);
  };

  // Helper function to show success messages
  const showSuccess = (message: string) => {
    setSnackMessage(message);
    setSnackSeverity("success");
    setSnackOpen(true);
  };

  // Helper function to show warning messages
  const showWarning = (message: string) => {
    setSnackMessage(message);
    setSnackSeverity("warning");
    setSnackOpen(true);
  };

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      const response = await shopApi.getShopByID(String(id));

      if (!mounted) return;

      if (response.success && response.data) {
        setShop(response.data);
      } else if (response.error) {
        showError(response.error.message);
        setShop(null);
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Validation function
  const validateField = (field: keyof Shop, value: string): string => {
    switch (field) {
      case "code":
        if (!value.trim()) return "Shop code is required";
        if (value.length < 2 || value.length > 10)
          return "Shop code must be 2-10 characters";
        return "";

      case "shopName":
        if (!value.trim()) return "Shop name is required";
        return "";

      case "contactName":
        if (!value.trim()) return "Contact name is required";
        return "";

      case "province":
        if (!value.trim()) return "Province is required";
        if (!/^[A-Z]{2}$/.test(value))
          return "Province must be 2 uppercase letters (e.g., AB, BC, ON)";
        return "";

      case "postalCode":
        if (!value.trim()) return "Postal code is required";
        if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(value.replace(/\s/g, "")))
          return "Postal code must be in format A1A1A1";
        return "";

      case "phone":
        if (!value.trim()) return "Phone is required";
        const phoneDigits = value.replace(/\D/g, "");
        if (phoneDigits.length !== 10)
          return "Phone must be 10 digits (XXX-XXX-XXXX)";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";

      case "address":
        if (!value.trim()) return "Address is required";
        return "";

      case "city":
        if (!value.trim()) return "City is required";
        return "";

      default:
        return "";
    }
  };

  // Format phone number as user types
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  // Format postal code as user types
  const formatPostalCode = (value: string): string => {
    const clean = value.replace(/\s/g, "").toUpperCase();
    if (clean.length <= 3) return clean;
    return `${clean.slice(0, 3)}${clean.slice(3, 6)}`;
  };

  // Validate all fields and update form validity
  const validateAllFields = (shopData: Shop) => {
    const errors: Record<string, string> = {};
    const requiredFields: (keyof Shop)[] = [
      "code",
      "shopName",
      "contactName",
      "phone",
      "email",
      "address",
      "city",
      "province",
      "postalCode",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, shopData[field] as string);
      if (error) errors[field] = error;
    });

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  // Enhanced edit change handler
  const handleEditChange = (field: keyof Shop, value: string) => {
    if (!editedShop) return;

    let formattedValue = value;

    // Apply formatting
    if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "postalCode") {
      formattedValue = formatPostalCode(value);
    } else if (field === "province") {
      formattedValue = value.toUpperCase();
    }

    const updatedShop = { ...editedShop, [field]: formattedValue };
    setEditedShop(updatedShop);

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Real-time validation only for the current field
    const error = validateField(field, formattedValue);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Check overall form validity but don't update field errors for untouched fields
    validateAllFields(updatedShop);
  };

  // Handle code change confirmation
 const handleCodeChangeConfirm = async () => {
  setShowCodeConfirm(false);
  setPendingCodeChange("");
  await handleSave(); // Save changes after confirming code change
};

  const handleCodeChangeCancel = () => {
    if (editedShop) {
      setEditedShop({ ...editedShop, code: originalCode });
    }
    setShowCodeConfirm(false);
    setPendingCodeChange("");
  };

  // Handle blur event for shop code field
  const handleCodeBlur = () => {
    if (editedShop && shop && editedShop.code !== shop.code) {
      setOriginalCode(shop.code);
      setPendingCodeChange(editedShop.code);
      setShowCodeConfirm(true);
    }
  };

  const handleEditOpen = () => {
    if (shop) {
      setEditedShop({ ...shop });
      setFieldErrors({});
      setTouchedFields({});
      setIsFormValid(true);
    }
    setOpenEdit(true);
  };

  const handleSave = async () => {
  if (!editedShop || !shop) return;

  // Validate all fields before submission
  const errors = validateAllFields(editedShop);

  // Mark all fields as touched to show errors
  const allTouched: Record<string, boolean> = {};
  Object.keys(editedShop).forEach((key) => {
    allTouched[key] = true;
  });
  setTouchedFields(allTouched);

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    showError("Please fix all validation errors before saving.");
    return;
  }

  setLoading(true);

  try {
    const response = await shopApi.updateShop(shop.id, editedShop);

    if (response.success && response.data) {
      setShop(response.data);
      setOpenEdit(false);
      showSuccess("Shop updated successfully!");
    } else if (response.error) {
      const msg = (response.error.message || "").toLowerCase();
      const isCodeConflict =
        msg.includes("code") &&
        (msg.includes("exists") ||
          msg.includes("already") ||
          msg.includes("duplicate"));

      if (isCodeConflict && editedShop.code !== shop.code) {
        setEditedShop((prev) =>
          prev ? { ...prev, code: shop.code } : prev
        );

        setFieldErrors((prev) => ({
          ...prev,
          code:
            "This shop code is already in use. It has been reverted to the original value.",
        }));

        showError(
          "This shop code is already in use. The code has been reverted to the original value."
        );
      } else {
        showError(response.error.message);
      }
    }
  } catch (error) {
    showError("Failed to update shop. Please try again.");
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
          Shop not found
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
        {/* Top row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box minWidth={0}>
            <Typography variant="h6" noWrap>
              {shop.shopName}
            </Typography>
            <Typography color="text.secondary" noWrap>
              {shop.contactName}
            </Typography>
            <Chip
              label={shop.status === "active" ? "Active" : "Inactive"}
              color={shop.status === "active" ? "success" : "default"}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <AppButton
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            Edit Shop
          </AppButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Details */}
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
              secondary={
                shop.createdAt
                  ? new Date(shop.createdAt).toLocaleString()
                  : "—"
              }
            />
          </ListItem>
        </List>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
          Edit Shop Details
          <IconButton
            aria-label="close"
            onClick={() => setOpenEdit(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editedShop && (
            <Stack spacing={2} mt={5}>
              <TextField
                label="Shop Code"
                value={editedShop.code}
                onChange={(e) => handleEditChange("code", e.target.value)}
                onBlur={handleCodeBlur}
                error={!!(touchedFields.code && fieldErrors.code)}
                helperText={touchedFields.code ? fieldErrors.code : ""}
                fullWidth
                required
              />
              <TextField
                label="Shop Name"
                value={editedShop.shopName}
                onChange={(e) => handleEditChange("shopName", e.target.value)}
                error={!!(touchedFields.shopName && fieldErrors.shopName)}
                helperText={touchedFields.shopName ? fieldErrors.shopName : ""}
                fullWidth
                required
              />
              <TextField
                label="Contact Name"
                value={editedShop.contactName}
                onChange={(e) => handleEditChange("contactName", e.target.value)}
                error={!!(touchedFields.contactName && fieldErrors.contactName)}
                helperText={touchedFields.contactName ? fieldErrors.contactName : ""}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={editedShop.phone}
                onChange={(e) => handleEditChange("phone", e.target.value)}
                error={!!(touchedFields.phone && fieldErrors.phone)}
                helperText={touchedFields.phone ? fieldErrors.phone : "Format: XXX-XXX-XXXX"}
                placeholder="XXX-XXX-XXXX"
                fullWidth
                required
              />
              <TextField
                label="Email"
                value={editedShop.email}
                onChange={(e) => handleEditChange("email", e.target.value)}
                error={!!(touchedFields.email && fieldErrors.email)}
                helperText={touchedFields.email ? fieldErrors.email : ""}
                type="email"
                fullWidth
                required
              />
              <TextField
                label="Address"
                value={editedShop.address}
                onChange={(e) => handleEditChange("address", e.target.value)}
                error={!!(touchedFields.address && fieldErrors.address)}
                helperText={touchedFields.address ? fieldErrors.address : ""}
                fullWidth
                required
              />
              <TextField
                label="City"
                value={editedShop.city}
                onChange={(e) => handleEditChange("city", e.target.value)}
                error={!!(touchedFields.city && fieldErrors.city)}
                helperText={touchedFields.city ? fieldErrors.city : ""}
                fullWidth
                required
              />
              <TextField
                label="Province"
                value={editedShop.province}
                onChange={(e) => handleEditChange("province", e.target.value)}
                error={!!(touchedFields.province && fieldErrors.province)}
                helperText={
                  touchedFields.province ? fieldErrors.province :
                    "2 uppercase letters (e.g., AB, BC, ON)"
                }
                placeholder="AB"
                inputProps={{ maxLength: 2 }}
                fullWidth
                required
              />
              <TextField
                label="Postal Code"
                value={editedShop.postalCode}
                onChange={(e) => handleEditChange("postalCode", e.target.value)}
                error={!!(touchedFields.postalCode && fieldErrors.postalCode)}
                helperText={touchedFields.postalCode ? fieldErrors.postalCode : "Format: A1A1A1"}
                placeholder="A1A1A1"
                inputProps={{ maxLength: 6 }}
                fullWidth
                required
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
          <AppButton
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Code Change Confirmation Dialog */}
      <Dialog
        open={showCodeConfirm}
        onClose={handleCodeChangeCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Shop Code Change</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You are about to change the shop code:
          </Typography>
          <Box sx={{ my: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              From: <strong>{originalCode}</strong> → To: <strong>{pendingCodeChange}</strong>
            </Typography>
          </Box>
          <Typography variant="body2" color="info.main">
            ℹ️ Cancel to revert the shop code to its original value.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <AppButton variant="outlined" onClick={handleCodeChangeCancel}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            color="primary"
            onClick={handleCodeChangeConfirm}
          >
            Confirm Change
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Error/Success Notification */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
