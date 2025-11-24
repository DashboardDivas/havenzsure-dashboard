// Source note:
// This file was partially refactored with assistance from AI (ChatGPT).
// Edited and reviewed by AN-NI HUANG
// Date: 2025-11-23
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import { CreateUserInput } from "@/types/user";
import { userApi } from "@/lib/api/userApi";
import { shopApi } from "@/lib/api/shopApi";

interface AddUserFormProps {
  onSuccess?: () => void;
}

interface Shop {
  id: string;
  code: string;
  shopName: string;
  status: "active" | "inactive";
}

export function AddUserForm({ onSuccess }: AddUserFormProps) {
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleCode: "",
    shopCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserInput, string>>
  >({});

  // shops
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState<string | null>(null);

  // Load active shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setShopsLoading(true);

        const response = await shopApi.getShops(500, 0);
        // Only keep active shops
        const rawList: any[] = Array.isArray(response.data)
          ? response.data
          : [];

        const activeOnly: Shop[] = rawList
          .filter((s) => s.status === "active")
          .map((s) => ({
            id: String(s.id),
            code: s.code,
            shopName: s.shopName,
            status: s.status,
          }));

        setShops(activeOnly);
      } catch (err: any) {
        console.error("Failed to load shops", err);
        setShopsError("Failed to load shops");
      } finally {
        setShopsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleChange = (field: keyof CreateUserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value || undefined }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) setError(null);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateUserInput, string>> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.roleCode) {
      newErrors.roleCode = "Role is required";
    }
    if (formData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Phone format must be: 403-123-4567";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      // Clean up empty optional fields
      const cleanedData: CreateUserInput = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleCode: formData.roleCode,
      };

      if (formData.phone?.trim()) {
        cleanedData.phone = formData.phone.trim();
      }
      if (formData.shopCode?.trim()) {
        cleanedData.shopCode = formData.shopCode.trim();
      }

      await userApi.create(cleanedData);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Failed to create user:", err);
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        {/* Name Fields */}
        <Box display="flex" gap={2}>
          <TextField
            label="First Name"
            required
            fullWidth
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={loading}
          />
          <TextField
            label="Last Name"
            required
            fullWidth
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={loading}
          />
        </Box>

        {/* Email */}
        <TextField
          label="Email"
          required
          fullWidth
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
        />

        {/* Phone */}
        <TextField
          label="Phone (Optional)"
          fullWidth
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone || "Format: 403-123-4567"}
          placeholder="403-123-4567"
          disabled={loading}
        />

        {/* Role */}
        <TextField
          select
          label="Role"
          required
          fullWidth
          value={formData.roleCode}
          onChange={(e) => handleChange("roleCode", e.target.value)}
          error={!!errors.roleCode}
          helperText={errors.roleCode}
          disabled={loading}
        >
          <MenuItem value="">Select Role</MenuItem>
          <MenuItem value="admin">Administrator</MenuItem>
          <MenuItem value="adjuster">Adjuster (Insurance Claims)</MenuItem>
          <MenuItem value="bodyman">Bodyman (Repair Technician)</MenuItem>
        </TextField>

        {/* Shop Autocomplete (Optional) */}
        <Autocomplete
          options={shops}
          loading={shopsLoading}
          value={shops.find((s) => s.code === formData.shopCode) || null}
          onChange={(_, value) =>
            handleChange("shopCode", value ? value.code : "")
          }
          getOptionLabel={(option) => `${option.code} — ${option.shopName}`}
          isOptionEqualToValue={(opt, value) => opt.code === value.code}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Shop (Optional for non-admins)"
              placeholder="Search shop by name or code"
              helperText={
                shopsError
                  ? shopsError
                  : "Only active shops are listed — leave empty if not assigned"
              }
              error={!!shopsError}
              disabled={loading}
            />
          )}
        />

        {/* Info note */}
        <Alert severity="info">
          💡 The user will receive an email with a link to set their password
        </Alert>

        {/* Submit */}
        <AppButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </AppButton>
      </Stack>
    </Box>
  );
}
