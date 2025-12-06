"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Fade,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  FormControl,
} from "@mui/material";
import { useTheme, styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close"; // <-- added
import { useRouter } from "next/navigation";

import AppTable, { Column } from "@/components/ui/Table";
import { AppButton } from "@/components/ui/Buttons";
import StatusChip from "@/components/ui/StatusChip";
import { shopApi, Shop, ApiResponse } from "@/lib/api/shopApi"; // ✅ UPDATED
import { AddShopForm } from "@/components/ui/AddShopForm";

// 🔍 Styled components
const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 3
      : 12,
  padding: theme.spacing(0.5, 1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.05)
      : alpha(theme.palette.common.black, 0.05),
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: 400,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default function ShopsPage() {
  const theme = useTheme();
  const router = useRouter();

  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof Shop | undefined>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Error notification state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error" | "warning">("error");

  // Validation state for add form
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [newShop, setNewShop] = useState<Partial<Shop>>({
    code: "",
    shopName: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    status: "active",
  });

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

  // 🧩 Fetch data from real API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await shopApi.getShops();

      if (response.success && response.data) {
        setShops(response.data);
        setFilteredShops(response.data);
      } else if (response.error) {
        showError(response.error.message);
        setShops([]);
        setFilteredShops([]);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  // 🔍 Handle search
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredShops(shops);
    } else {
      const lower = query.toLowerCase();
      setFilteredShops(
        shops.filter(
          (s) =>
            s.shopName.toLowerCase().includes(lower) ||
            s.code.toLowerCase().includes(lower) ||
            s.address.toLowerCase().includes(lower)
        )
      );
    }
    setPage(0);
  };

  // Run search automatically when query or shops change so the summary reflects real results
  React.useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, shops]);

  // ❌ Clear search handler
  const handleClearSearch = () => {
    setQuery("");
    setFilteredShops(shops);
    setPage(0);
    // immediate visual feedback is provided by state updates (re-render)
  };

  // 🔄 Sorting logic
  const handleSortChange = (id: keyof Shop) => {
    const isAsc = orderBy === id && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(id);

    const sorted = [...filteredShops].sort((a, b) => {
      const valA = a[id];
      const valB = b[id];
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;
      return (valA < valB ? -1 : 1) * (isAsc ? 1 : -1);
    });
    setFilteredShops(sorted);
  };

  // Handle status change
  const handleStatusChange = async (shopId: string, 
    newStatus: "active" | "inactive",) => {
  // Find the current shop object
  const currentShop = shops.find((shop) => shop.id === shopId);
  if (!currentShop) {
    showError("Shop not found");
    return;
  }

  // Create complete updated shop object
  const updatedShop: Shop = {
    ...currentShop,
    status: newStatus,
  };

  const response = await shopApi.updateShop(shopId, updatedShop);

  if (response.success && response.data) {
    // Update local state
    setShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId ? { ...shop, status: newStatus } : shop
      )
    );
    setFilteredShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId ? { ...shop, status: newStatus } : shop
      )
    );
    showSuccess(`Shop status updated to ${newStatus}`);
  } else if (response.error) {
    showError(response.error.message);
  }
};

  // 🧱 Table columns
  const columns: Column<Shop>[] = [
    { id: "code", label: "Shop Code", sortable: true },
    { id: "shopName", label: "Shop Name", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status} />,
    },
    { id: "address", label: "Address", sortable: true },
    { id: "postalCode", label: "Postal Code", sortable: true },
    { id: "contactName", label: "Contact Name", sortable: true },
    { id: "phone", label: "Phone", sortable: true },
    { id: "email", label: "Email", sortable: true },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <FormControl size="small" sx={{ minWidth: 100 }} onClick={(e) => e.stopPropagation()}>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value as "active" | "inactive")}
            onClick={(e) => e.stopPropagation()}
            variant="outlined"
            sx={{
              fontSize: "0.875rem",
              "& .MuiSelect-select": {
                py: 0.5,
              },
            }}
          >
            <MenuItem value="active" onClick={(e) => e.stopPropagation()}>Active</MenuItem>
            <MenuItem value="inactive" onClick={(e) => e.stopPropagation()}>Inactive</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  // Validation function (same as edit form)
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
        if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(value.replace(/\s/g, ""))) {
          return "Postal code must be in format A1A1A1";
        }
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
  const validateAllFields = (shopData: Partial<Shop>) => {
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
      const value = shopData[field] as string || "";
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    setIsFormValid(Object.keys(errors).length === 0);
    return errors;
  };

  // Handle field changes with validation
  const handleNewShopChange = (field: keyof Shop, value: string) => {
    let formattedValue = value;

    // Apply formatting
    if (field === "phone") {
      formattedValue = formatPhone(value);
    } else if (field === "postalCode") {
      formattedValue = formatPostalCode(value);
    } else if (field === "province") {
      formattedValue = value.toUpperCase();
    }

    const updatedShop = { ...newShop, [field]: formattedValue };
    setNewShop(updatedShop);

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

  // Reset form when opening dialog
  const handleOpenAddDialog = () => {
    setNewShop({
      code: "",
      shopName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      status: "active",
    });
    setFieldErrors({});
    setTouchedFields({});
    setIsFormValid(false);
    setOpen(true);
  };

  // Clear form function
  const handleClearForm = () => {
    setNewShop({
      code: "",
      shopName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      status: "active",
    });
    setFieldErrors({});
    setTouchedFields({});
    setIsFormValid(false);
  };

  // Handle form submission
  const handleAddShop = async () => {
    // Validate all fields and show errors for submission
    const allErrors = validateAllFields(newShop);
    setFieldErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      // Mark all required fields as touched so errors show
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

      const allTouched = requiredFields.reduce((acc, field) => ({
        ...acc,
        [field]: true
      }), {});

      setTouchedFields(allTouched);
      return;
    }

    setLoading(true);
    const response = await shopApi.createShop(newShop as Shop);

    if (response.success && response.data) {
      setShops((prev) => [...prev, response.data!]);
      setFilteredShops((prev) => [...prev, response.data!]);
      setOpen(false);
      showSuccess(`Shop created successfully!`);
      console.log("✅ Shop created:", response.data);
    } else if (response.error) {
      showError(response.error.message);
    }

    setLoading(false);
  };

  return (
    <Fade in timeout={400}>
      <Box p={3}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={600}>
            Shops Overview
          </Typography>
          <AppButton variant="contained" onClick={handleOpenAddDialog}>
            + Add New Shop
          </AppButton>
        </Stack>

        {/* Search Bar */}
        <Box mb={2} display="flex" justifyContent="flex-start">
          <SearchContainer>
            <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <StyledInputBase
              placeholder="Enter Shop Name, Code, or Address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <AppButton
              variant="contained"
              size="small"
              onClick={handleSearch}
              sx={{ ml: 1, borderRadius: "9999px" }}
            >
              Search
            </AppButton>
          </SearchContainer>
        </Box>

        {/* --- New: Search results summary + Clear button (shows when a query is active) --- */}
        {query.trim() !== "" && (
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1,
              p: 1,
              border: `1px solid ${theme.palette.divider}`,
              width: "100%",
              maxWidth: 700,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              Found{" "}
              {filteredShops.length} shop
              {filteredShops.length !== 1 ? "s" : ""} matching "{query}"
            </Typography>
            <IconButton
              size="small"
              aria-label="Clear search"
              onClick={handleClearSearch}
              sx={{
                ml: 1,
                borderRadius: "9999px",
                backgroundColor: "transparent",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Table */}
        <AppTable<Shop>
          columns={columns}
          data={filteredShops.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )}
          loading={loading}
          total={filteredShops.length}
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
              router.push(`/shops/${row.id}`); // ✅ Navigate by id
              element.style.opacity = "1";
            }, 300);
          }}
        />

        {/* Add Shop Dialog with Validation */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
            Add New Shop
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                color: theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Shop Code"
                value={newShop.code || ""}
                onChange={(e) => handleNewShopChange("code", e.target.value)}
                error={!!(touchedFields.code && fieldErrors.code)}
                helperText={touchedFields.code ? fieldErrors.code : ""}
                fullWidth
                required
              />
              <TextField
                label="Shop Name"
                value={newShop.shopName || ""}
                onChange={(e) => handleNewShopChange("shopName", e.target.value)}
                error={!!(touchedFields.shopName && fieldErrors.shopName)}
                helperText={touchedFields.shopName ? fieldErrors.shopName : ""}
                fullWidth
                required
              />
              <TextField
                label="Contact Name"
                value={newShop.contactName || ""}
                onChange={(e) =>
                  handleNewShopChange("contactName", e.target.value)
                }
                error={!!(touchedFields.contactName && fieldErrors.contactName)}
                helperText={touchedFields.contactName ? fieldErrors.contactName : ""}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={newShop.phone || ""}
                onChange={(e) => handleNewShopChange("phone", e.target.value)}
                error={!!(touchedFields.phone && fieldErrors.phone)}
                helperText={touchedFields.phone ? fieldErrors.phone : "Format: XXX-XXX-XXXX"}
                placeholder="XXX-XXX-XXXX"
                fullWidth
                required
              />
              <TextField
                label="Email"
                value={newShop.email || ""}
                onChange={(e) => handleNewShopChange("email", e.target.value)}
                error={!!(touchedFields.email && fieldErrors.email)}
                helperText={touchedFields.email ? fieldErrors.email : ""}
                type="email"
                fullWidth
                required
              />
              <TextField
                label="Address"
                value={newShop.address || ""}
                onChange={(e) => handleNewShopChange("address", e.target.value)}
                error={!!(touchedFields.address && fieldErrors.address)}
                helperText={touchedFields.address ? fieldErrors.address : ""}
                fullWidth
                required
              />
              <TextField
                label="City"
                value={newShop.city || ""}
                onChange={(e) => handleNewShopChange("city", e.target.value)}
                error={!!(touchedFields.city && fieldErrors.city)}
                helperText={touchedFields.city ? fieldErrors.city : ""}
                fullWidth
                required
              />
              <TextField
                label="Province"
                value={newShop.province || ""}
                onChange={(e) => handleNewShopChange("province", e.target.value)}
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
                value={newShop.postalCode || ""}
                onChange={(e) => handleNewShopChange("postalCode", e.target.value)}
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
                value={newShop.status || "active"}
                onChange={(e) => handleNewShopChange("status", e.target.value)}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pr: 3, pb: 2 }}>
            <AppButton variant="outlined" onClick={handleClearForm} sx={{ mr: "auto" }}>
              Clear
            </AppButton>
            <AppButton variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              color="primary"
              onClick={handleAddShop}
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating..." : "Add Shop"}
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
    </Fade>
  );
}
