"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import { shopApi, Shop } from "@/api/shopApi";

interface AddShopData {
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

export function AddShopForm() {
  const [formData, setFormData] = useState<AddShopData>({
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

  // 🧩 Load existing contacts (optional dropdown)
  useEffect(() => {
    shopApi.getShops().then((shops) => {
      const contacts = Array.from(new Set(shops.map((s) => s.contactName)));
      setExistingContacts(contacts);
    });
  }, []);

  const handleChange = (field: keyof AddShopData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddShopData, string>> = {};

    if (!formData.shopName.trim()) newErrors.shopName = "Required";
    if (!formData.contactName.trim()) newErrors.contactName = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.province.trim()) newErrors.province = "Required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const createdShop = await shopApi.createShop(formData);
      console.log("✅ Shop created:", createdShop);
      alert(`Shop "${createdShop.shopName}" added successfully!`);

      // Reset form
      handleCancel();
    } catch (err) {
      console.error("❌ Failed to create shop:", err);
      alert("Failed to create shop. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
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
              {/* Shop Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Shop Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  {/* Shop Name */}
                  <TextField
                    label="Shop Name"
                    required
                    fullWidth
                    value={formData.shopName}
                    onChange={(e) => handleChange("shopName", e.target.value)}
                    error={!!errors.shopName}
                    helperText={errors.shopName}
                    placeholder="e.g., QuickFix Garage"
                  />

                  {/* Contact Name */}
                  <FormControl fullWidth required>
                    <InputLabel>Contact Name</InputLabel>
                    <Select
                      value={formData.contactName}
                      label="Contact Name"
                      onChange={(e) => handleChange("contactName", e.target.value)}
                    >
                      {existingContacts.map((contact) => (
                        <MenuItem key={contact} value={contact}>
                          {contact}
                        </MenuItem>
                      ))}
                      <MenuItem value="" disabled>
                        ────────────
                      </MenuItem>
                      <MenuItem value="Other">Add New Contact</MenuItem>
                    </Select>
                    {errors.contactName && (
                      <Typography variant="caption" color="error">
                        {errors.contactName}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Address Details */}
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
                      onChange={(e) => handleChange("postalCode", e.target.value)}
                      error={!!errors.postalCode}
                      helperText={errors.postalCode}
                    />
                  </Box>

                  {/* City & Province */}
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
                      onChange={(e) => handleChange("province", e.target.value)}
                      error={!!errors.province}
                      helperText={errors.province}
                    />
                  </Box>

                  {/* Phone & Email */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Phone"
                      required
                      fullWidth
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      placeholder="555-123-4567"
                    />
                    <TextField
                      label="Email"
                      required
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="shop@example.com"
                    />
                  </Box>

                  {/* Status */}
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleChange("status", e.target.value)}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {/* Actions */}
              <Box
                display="flex"
                flexDirection={{ xs: "column-reverse", sm: "row" }}
                gap={2}
                pt={2}
              >
                <AppButton
                  variant="outlined"
                  onClick={handleCancel}
                  size="large"
                  sx={{ flex: { xs: 1, sm: "initial" } }}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
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
