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
import { fakeApi } from "@/lib/fakeApi";

interface AddShopData {
  name: string;
  owner: string;
  status: "active" | "inactive";
  address: string;
  postalCode: string;
  contact: string;
  email: string;
}

export function AddShopForm() {
  const [formData, setFormData] = useState<AddShopData>({
    name: "",
    owner: "",
    status: "active",
    address: "",
    postalCode: "",
    contact: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddShopData, string>>>({});
  const [existingOwners, setExistingOwners] = useState<string[]>([]);

  useEffect(() => {
    fakeApi.getShops().then((shops) => {
      const owners = Array.from(new Set(shops.map((s) => s.owner)));
      setExistingOwners(owners);
    });
  }, []);

  const handleChange = (field: keyof AddShopData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddShopData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.owner.trim()) newErrors.owner = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Required";
    if (!formData.contact.trim()) newErrors.contact = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("✅ Shop Form Submitted:", formData);
      alert("Shop has been added successfully!");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      owner: "",
      status: "active",
      address: "",
      postalCode: "",
      contact: "",
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
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="e.g., QuickFix Garage"
                  />

                  {/* Owner */}
                  <FormControl fullWidth required>
                    <InputLabel>Owner</InputLabel>
                    <Select
                      value={formData.owner}
                      label="Owner"
                      onChange={(e) => handleChange("owner", e.target.value)}
                    >
                      {existingOwners.map((owner) => (
                        <MenuItem key={owner} value={owner}>
                          {owner}
                        </MenuItem>
                      ))}
                      <MenuItem value="" disabled>
                        ────────────
                      </MenuItem>
                      <MenuItem value="Other">Add New Owner</MenuItem>
                    </Select>
                    {errors.owner && (
                      <Typography variant="caption" color="error">
                        {errors.owner}
                      </Typography>
                    )}
                  </FormControl>

                  {/* Address & Postal Code */}
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

                  {/* Contact & Email */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Contact Number"
                      required
                      fullWidth
                      value={formData.contact}
                      onChange={(e) => handleChange("contact", e.target.value)}
                      error={!!errors.contact}
                      helperText={errors.contact}
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
                  size="large"
                  sx={{ flex: { xs: 1, sm: "initial" }, ml: { sm: "auto" } }}
                >
                  Add Shop
                </AppButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
