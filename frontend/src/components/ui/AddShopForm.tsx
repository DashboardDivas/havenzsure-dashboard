"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import { shopApi, Shop } from "@/lib/api/shopApi";

interface AddShopData {
  code: string;
  shopName: string;
  contactName: string;
  status: "active" | "inactive";
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
  email: string;
}

// --- Regex validators ---
const regex = {
  province: /^[A-Z]{2}$/,
  postalCode: /^[A-Z]\d[A-Z]\d[A-Z]\d$/,
  phone: /^\d{3}-\d{3}-\d{4}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
};

// --- Field validation function ---
const validateField = (field: keyof AddShopData, value: string): string => {
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
      if (!regex.postalCode.test(v.toUpperCase())) return "Format: T3K1V5";
      break;
    case "phone":
      if (!v) return "Required";
      if (!regex.phone.test(v)) return "Format: 403-555-1234";
      break;
    case "email":
      if (!v) return "Required";
      if (!regex.email.test(v)) return "Invalid email format.Try sample@gmail.com";
      break;
    default:
      if (!v) return "Required";
  }
  return "";
};

// --- Backend API error type ---
interface ApiErrorResponse {
  error: "validation_error" | "conflict" | string;
  field?: keyof AddShopData;
  message?: string;
}

export function AddShopForm() {
  const [formData, setFormData] = useState<AddShopData>({
    code: "",
    shopName: "",
    contactName: "",
    status: "active",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddShopData, string>>>({});
  const [existingContacts, setExistingContacts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 🧩 Load existing contacts
  useEffect(() => {
    shopApi.getShops().then((shops) => {
      const contacts = Array.from(new Set(shops.map((s) => s.contactName)));
      setExistingContacts(contacts);
    });
  }, []);

  const handleChange = (field: keyof AddShopData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const errMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errMsg }));
  };

  const isFormValid = useMemo(() => {
    return Object.entries(formData).every(
      ([k, v]) => validateField(k as keyof AddShopData, v) === ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newErrors: Partial<Record<keyof AddShopData, string>> = {};
    (Object.keys(formData) as (keyof AddShopData)[]).forEach((field) => {
      const msg = validateField(field, formData[field]);
      if (msg) newErrors[field] = msg;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);
      const createdShop = await shopApi.createShop(formData);
      alert(`✅ Shop "${createdShop.shopName}" added successfully!`);
      handleCancel();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: unknown } }).response?.data === "object"
      ) {
        const data = (err as { response: { data: ApiErrorResponse } }).response.data;
        if (data.error === "validation_error" && data.field && data.message) {
          setErrors((prev) => ({ ...prev, [data.field!]: data.message }));
        } else if (data.error === "conflict") {
          alert("A shop with this code already exists.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        alert("Network or unknown error. Please retry.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      code: "",
      shopName: "",
      contactName: "",
      status: "active",
      address: "",
      postalCode: "",
      city: "",
      province: "",
      phone: "",
      email: "",
    });
    setErrors({});
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={12}>
          <CardHeader
            title={<Typography variant="h4">Add New Shop</Typography>}
            subheader={
              <Typography variant="body1" color="text.secondary">
                Fill in the details below to register a new repair shop
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Shop Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <TextField
                    label="Shop Code"
                    required
                    fullWidth
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    error={!!errors.code}
                    helperText={errors.code}
                  />
                  <TextField
                    label="Shop Name"
                    required
                    fullWidth
                    value={formData.shopName}
                    onChange={(e) => handleChange("shopName", e.target.value)}
                    error={!!errors.shopName}
                    helperText={errors.shopName}
                  />

                  <Autocomplete
                    freeSolo
                    options={existingContacts}
                    value={formData.contactName}
                    onChange={(_, newValue) => handleChange("contactName", newValue || "")}
                    onInputChange={(_, newInputValue) =>
                      handleChange("contactName", newInputValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contact Name"
                        required
                        error={!!errors.contactName}
                        helperText={errors.contactName}
                      />
                    )}
                  />

                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Address"
                      required
                      fullWidth
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      error={!!errors.address}
                      helperText={errors.address}
                    />
                    <TextField
                      label="Postal Code"
                      required
                      fullWidth
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value.toUpperCase())}
                      error={!!errors.postalCode}
                      helperText={errors.postalCode}
                      placeholder="A1A1A1"
                    />
                  </Box>

                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="City"
                      required
                      fullWidth
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                    <TextField
                      label="Province"
                      required
                      fullWidth
                      value={formData.province}
                      onChange={(e) => handleChange("province", e.target.value.toUpperCase())}
                      error={!!errors.province}
                      helperText={errors.province}
                      placeholder="AB, BC, ON..."
                    />
                  </Box>

                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Phone"
                      required
                      fullWidth
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      placeholder="403-555-1234"
                    />
                    <TextField
                      label="Email"
                      required
                      fullWidth
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="shop@example.com"
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleChange("status", e.target.value as AddShopData["status"])}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              <Box display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} gap={2} pt={2}>
                <AppButton variant="outlined" onClick={handleCancel} size="large" sx={{ flex: { xs: 1, sm: "initial" } }}>
                  Clear
                </AppButton>
                <AppButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isFormValid || submitting}
                  size="large"
                  sx={{ flex: { xs: 1, sm: "initial" }, ml: { sm: "auto" } }}
                >
                  {submitting ? "Adding..." : "Add Shop"}
                </AppButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
