"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { Upload, X } from "lucide-react";
import { AppButton } from "@/components/ui/Buttons"; // ✅ use your custom button

interface AddUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export function AddUserForm() {
  const [formData, setFormData] = useState<AddUserData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "active",
    password: "",
    confirmPassword: "",
    profilePicture: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    gender: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddUserData, string>>
  >({});
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleChange = (field: keyof AddUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev) => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddUserData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.role) newErrors.role = "Required";
    if (!formData.password) newErrors.password = "Required";
    else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("User Form Submitted:", formData);
      alert("User has been created successfully!");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "active",
      password: "",
      confirmPassword: "",
      profilePicture: "",
      dateOfBirth: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      gender: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    });
    setErrors({});
    setPreviewImage("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #f3e5f5 100%)",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Card elevation={12}>
          <CardHeader
            title={<Typography variant="h4">Add New User</Typography>}
            subheader={
              <Typography variant="body1" color="text.secondary">
                Fill in the information below to create a new user account
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  {/* Profile Picture */}
                  <Box>
                    <FormLabel>Profile Picture / Avatar</FormLabel>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Avatar src={previewImage} sx={{ width: 80, height: 80 }}>
                        {formData.firstName.charAt(0)}
                        {formData.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="profile-picture-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="profile-picture-upload">
                          <AppButton
                            variant="outlined"
                            component="span"
                            startIcon={<Upload size={16} />}
                          >
                            Upload Image
                          </AppButton>
                        </label>
                        {previewImage && (
                          <IconButton onClick={clearImage} size="small" sx={{ ml: 1 }}>
                            <X size={16} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Name */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="First Name"
                      required
                      fullWidth
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                    <TextField
                      label="Last Name"
                      required
                      fullWidth
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
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
                    placeholder="user@example.com"
                  />

                  {/* Role & Status */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <FormControl fullWidth required error={!!errors.role}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={formData.role}
                        label="Role"
                        onChange={(e) => handleChange("role", e.target.value)}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="contractor">Contractor</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                      </Select>
                      {errors.role && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 0.5, ml: 1.75 }}
                        >
                          {errors.role}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => handleChange("status", e.target.value)}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Passwords */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Password"
                      required
                      fullWidth
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password || "Minimum 8 characters"}
                    />
                    <TextField
                      label="Confirm Password"
                      required
                      fullWidth
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Box>

                  {/* Date of Birth */}
                  <TextField
                    label="Date of Birth"
                    fullWidth
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Gender */}
                  <FormControl component="fieldset">
                    <FormLabel>Gender (Optional)</FormLabel>
                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                      <FormControlLabel
                        value="prefer-not-to-say"
                        control={<Radio />}
                        label="Prefer not to say"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              </Box>

              {/* Address Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Address Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <TextField
                    label="Street Address"
                    fullWidth
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                    placeholder="123 Main Street, Apt 4B"
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="City"
                      fullWidth
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                    <TextField
                      label="State / Province"
                      fullWidth
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="e.g., CA"
                    />
                    <TextField
                      label="ZIP / Postal Code"
                      fullWidth
                      value={formData.zip}
                      onChange={(e) => handleChange("zip", e.target.value)}
                    />
                  </Box>

                  <TextField
                    label="Country"
                    fullWidth
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="e.g., United States"
                  />
                </Stack>
              </Box>

              {/* Emergency Contact Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Emergency Contact
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <TextField
                    label="Contact Name"
                    fullWidth
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleChange("emergencyContactName", e.target.value)
                    }
                    placeholder="Full name"
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Contact Phone"
                      fullWidth
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) =>
                        handleChange("emergencyContactPhone", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                    />
                    <TextField
                      label="Relationship"
                      fullWidth
                      value={formData.emergencyContactRelationship}
                      onChange={(e) =>
                        handleChange("emergencyContactRelationship", e.target.value)
                      }
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column-reverse", sm: "row" },
                  gap: 2,
                  pt: 2,
                }}
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
                  Create User
                </AppButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
