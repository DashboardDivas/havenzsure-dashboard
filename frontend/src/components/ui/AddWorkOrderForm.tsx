"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppButton } from "@/components/ui/Buttons";
import { createWorkOrder } from "@/lib/api/workorderApi"; // ✅ real API
import { shopApi } from "@/lib/api/shopApi";
import { Shop } from "@/types/workorder";

interface WorkOrderData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  make: string;
  model: string;
  bodyStyle: string;
  vin: string;
  year: string;
  color: string;
  damageDate: string;
  plateNumber: string;
  insuranceCompany: string;
  agentFirstName: string;
  agentLastName: string;
  agentPhoneNumber: string;
  policyNumber: string;
  claimNumber: string;
  shopCode: string;
}

export function WorkOrderForm() {
  const theme = useTheme();

  const [formData, setFormData] = useState<WorkOrderData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    bodyStyle: "",
    vin: "",
    year: "",
    color: "",
    damageDate: "",
    plateNumber: "",
    insuranceCompany: "",
    agentFirstName: "",
    agentLastName: "",
    agentPhoneNumber: "",
    policyNumber: "",
    claimNumber: "",
    shopCode: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof WorkOrderData, string>>
  >({});
  const [loading, setLoading] = useState(false);

  // shopss
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

  const handleChange = (field: keyof WorkOrderData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof WorkOrderData, string>> = {};

    // Personal Info
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.city.trim()) newErrors.city = "Required";
    if (!formData.state.trim()) newErrors.state = "Required";
    if (!formData.zip.trim()) newErrors.zip = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";

    // Vehicle Info
    if (!formData.make.trim()) newErrors.make = "Required";
    if (!formData.model.trim()) newErrors.model = "Required";
    if (!formData.bodyStyle.trim()) newErrors.bodyStyle = "Required";
    if (!formData.vin.trim()) newErrors.vin = "Required";
    if (!formData.year.trim()) newErrors.year = "Required";
    if (!formData.color.trim()) newErrors.color = "Required";
    if (!formData.damageDate.trim()) newErrors.damageDate = "Required";

    // Insurance Info
    if (!formData.insuranceCompany.trim())
      newErrors.insuranceCompany = "Required";
    if (!formData.agentFirstName.trim())
      newErrors.agentFirstName = "Required";
    if (!formData.agentLastName.trim()) newErrors.agentLastName = "Required";
    if (!formData.agentPhoneNumber.trim())
      newErrors.agentPhoneNumber = "Required";
    if (!formData.policyNumber.trim()) newErrors.policyNumber = "Required";
    if (!formData.claimNumber.trim()) newErrors.claimNumber = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        damageDate: formData.damageDate || undefined,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.zip,
          province: formData.state,
          email: formData.email,
          phone: formData.phone,
        },
        vehicle: {
          plateNo: formData.plateNumber,      
          make: formData.make,
          model: formData.model,
          bodyStyle: formData.bodyStyle,
          modelYear: parseInt(formData.year),
          vin: formData.vin,
          color: formData.color,
        },
        insurance: {
          insuranceCompany: formData.insuranceCompany,
          agentFirstName: formData.agentFirstName,
          agentLastName: formData.agentLastName,
          agentPhone: formData.agentPhoneNumber,
          policyNumber: formData.policyNumber,
          claimNumber: formData.claimNumber,
        },
        shop: {
          shopCode: formData.shopCode,
        }
        //shopId: "b9d5b5ec-14d9-4ff8-9db0-8c4a2f781e61",
        //createdByUserId: "13fbd8c4-cd6a-4c4a-b4d8-b417ed14b12a",
      };

      const res = await createWorkOrder(payload);
      console.log("✅ Work Order Created:", res.code);
      alert(`Work order created successfully! ID: ${res.code}`);
      handleCancel();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Error creating work order:", err.message);
      } else {
        console.error("❌ Error creating work order:", err);
      }
      alert("Failed to create work order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      make: "",
      model: "",
      bodyStyle: "",
      vin: "",
      year: "",
      color: "",
      damageDate: "",
      plateNumber: "",
      insuranceCompany: "",
      agentFirstName: "",
      agentLastName: "",
      agentPhoneNumber: "",
      policyNumber: "",
      claimNumber: "",
      shopCode: "",
    });
    setErrors({});
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.action.hover} 100%)`,
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Card elevation={12}>
          <CardHeader
            title={
              <Typography variant="h4" component="h1" color="primary">
                New Work Order
              </Typography>
            }
            subheader={
              <Typography variant="body1" color="text.secondary">
                Complete the form below to create a new work order
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {/* === Personal Information === */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
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
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                    <TextField
                      label="Last Name"
                      required
                      fullWidth
                      value={formData.lastName}
                      onChange={(e) =>
                        handleChange("lastName", e.target.value)
                      }
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Box>

                  <TextField
                    label="Address"
                    required
                    fullWidth
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
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
                      required
                      fullWidth
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                    <TextField
                      label="State"
                      required
                      fullWidth
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                    <TextField
                      label="ZIP"
                      required
                      fullWidth
                      value={formData.zip}
                      onChange={(e) => handleChange("zip", e.target.value)}
                      error={!!errors.zip}
                      helperText={errors.zip}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Phone #"
                      fullWidth
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    <TextField
                      label="E-mail"
                      required
                      fullWidth
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* === Vehicle Information === */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Vehicle Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Make"
                      required
                      fullWidth
                      value={formData.make}
                      onChange={(e) => handleChange("make", e.target.value)}
                      error={!!errors.make}
                      helperText={errors.make}
                    />
                    <TextField
                      label="Model"
                      required
                      fullWidth
                      value={formData.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                      error={!!errors.model}
                      helperText={errors.model}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Body Style"
                      required
                      fullWidth
                      value={formData.bodyStyle}
                      onChange={(e) =>
                        handleChange("bodyStyle", e.target.value)
                      }
                      error={!!errors.bodyStyle}
                      helperText={errors.bodyStyle}
                    />
                    <TextField
                      label="VIN #"
                      required
                      fullWidth
                      value={formData.vin}
                      onChange={(e) => handleChange("vin", e.target.value)}
                      error={!!errors.vin}
                      helperText={errors.vin}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Year"
                      required
                      fullWidth
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      error={!!errors.year}
                      helperText={errors.year}
                    />
                    <TextField
                      label="Color"
                      required
                      fullWidth
                      value={formData.color}
                      onChange={(e) => handleChange("color", e.target.value)}
                      error={!!errors.color}
                      helperText={errors.color}
                    />
                    <TextField
                      label="Damage Date"
                      type="date"
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.damageDate}
                      onChange={(e) =>
                        handleChange("damageDate", e.target.value)
                      }
                      error={!!errors.damageDate}
                      helperText={errors.damageDate}
                    />
                  </Box>

                  <TextField
                    label="Plate Number"
                    fullWidth
                    value={formData.plateNumber}
                    onChange={(e) =>
                      handleChange("plateNumber", e.target.value)
                    }
                  />
                </Stack>
              </Box>

              {/* === Insurance Information === */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Insurance Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  <TextField
                    label="Insurance Company"
                    required
                    fullWidth
                    value={formData.insuranceCompany}
                    onChange={(e) =>
                      handleChange("insuranceCompany", e.target.value)
                    }
                    error={!!errors.insuranceCompany}
                    helperText={errors.insuranceCompany}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Agent First Name"
                      required
                      fullWidth
                      value={formData.agentFirstName}
                      onChange={(e) =>
                        handleChange("agentFirstName", e.target.value)
                      }
                      error={!!errors.agentFirstName}
                      helperText={errors.agentFirstName}
                    />
                    <TextField
                      label="Agent Last Name"
                      required
                      fullWidth
                      value={formData.agentLastName}
                      onChange={(e) =>
                        handleChange("agentLastName", e.target.value)
                      }
                      error={!!errors.agentLastName}
                      helperText={errors.agentLastName}
                    />
                  </Box>

                  <TextField
                    label="Agent Phone Number"
                    required
                    fullWidth
                    value={formData.agentPhoneNumber}
                    onChange={(e) =>
                      handleChange("agentPhoneNumber", e.target.value)
                    }
                    error={!!errors.agentPhoneNumber}
                    helperText={errors.agentPhoneNumber}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      label="Policy Number"
                      required
                      fullWidth
                      value={formData.policyNumber}
                      onChange={(e) =>
                        handleChange("policyNumber", e.target.value)
                      }
                      error={!!errors.policyNumber}
                      helperText={errors.policyNumber}
                    />
                    <TextField
                      label="Claim Number"
                      required
                      fullWidth
                      value={formData.claimNumber}
                      onChange={(e) =>
                        handleChange("claimNumber", e.target.value)
                      }
                      error={!!errors.claimNumber}
                      helperText={errors.claimNumber}
                    />
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
                                  label="Shop"
                                  placeholder="Search shop by name or code"
                                  helperText={
                                    shopsError
                                      ? shopsError
                                      : "Placeholder for Shop selection"
                                  }
                                  error={!!shopsError}
                                  disabled={loading}
                                />
                              )}
                            />
                  </Box>
                  
                </Stack>
              </Box>

              {/* === Actions === */}
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
                  disabled={loading}
                >
                  Cancel
                </AppButton>
                <AppButton
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ flex: { xs: 1, sm: "initial" }, ml: { sm: "auto" } }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </AppButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
