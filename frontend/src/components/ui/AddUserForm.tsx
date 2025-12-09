// Source note:
// This file was partially refactored with assistance from AI (ChatGPT).
// Edited and reviewed by AN-NI HUANG
// Date: 2025-11-23
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { formatPhone } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
  const { user: currentUser } = useAuth();
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
        console.log("Failed to load shops", err);
        setShopsError("Failed to load shops");
      } finally {
        setShopsLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filter shops based on current user's role
  const visibleShops = useMemo(() => {
    // No shops loaded
    if (!shops.length) return shops;

    // No current user info
    if (!currentUser) return shops;

    // SuperAdmin keep as is: can see all shops
    if (currentUser.roleCode !== "admin") {
      return shops;
    }

    // Admin: only show their own shop
    const adminShopId = currentUser.shopId;

    if (!adminShopId) {
      // This theoretically shouldn't happen, fallback to all to avoid empty dropdown
      return shops;
    }

    return shops.filter((shop) => shop.id === adminShopId);
  }, [shops, currentUser]);

  // Auto-assign shopCode for admin users
   useEffect(() => {
    if (!currentUser || currentUser.roleCode !== "admin") return;
    if (!currentUser.shopId) return;
    if (formData.shopCode) return; // already set

    const match = shops.find((s) => s.id === currentUser.shopId);
    if (match) {
      setFormData((prev) => ({ ...prev, shopCode: match.code }));
    }
  }, [currentUser, shops, formData.shopCode]);

  const handleChange = (field: keyof CreateUserInput, value: string) => {
    let newValue = value;
    if (field === "phone") {
      newValue = formatPhone(value);
    }
    setFormData((prev) => ({ ...prev, [field]: newValue || undefined }));
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
      console.log("Failed to create user:", err);
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
            id="first-name"
            name="firstName"
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
            id="last-name"
            name="lastName"
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
          id="email"
          name="email"
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
          id="phone"
          name="phone"
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
          id="role-select"
          name="roleCode"
          value={formData.roleCode}
          onChange={(e) => handleChange("roleCode", e.target.value)}
          error={!!errors.roleCode}
          helperText={
            errors.roleCode ||
            (currentUser?.roleCode !== "superadmin"
              ? "Note: Only SuperAdmins can create Admin or SuperAdmin users"
              : "")
          }
          disabled={loading}
        >
          {/* SuperAdmin option - only enabled for superadmin users */}
          <MenuItem
            value="superadmin"
            disabled={currentUser?.roleCode !== "superadmin"}
          >
            Super Administrator
            {currentUser?.roleCode !== "superadmin" && " (Restricted)"}
          </MenuItem>

          {/* Admin option - only enabled for superadmin users */}
          <MenuItem
            value="admin"
            disabled={currentUser?.roleCode !== "superadmin"}
          >
            Administrator
            {currentUser?.roleCode !== "superadmin" && " (Restricted)"}
          </MenuItem>

          <MenuItem value="adjuster">Adjuster (Insurance Claims)</MenuItem>
          <MenuItem value="bodyman">Bodyman (Repair Technician)</MenuItem>
        </TextField>

        {/* Shop Autocomplete */}
        <Autocomplete
          options={visibleShops}
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
              label="Shop (Required for non-SuperAdmin users)"
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
