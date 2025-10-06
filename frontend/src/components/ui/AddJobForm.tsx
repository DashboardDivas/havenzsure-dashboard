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
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import AppDropdown from "@/components/ui/Dropdown";

interface AddJobData {
  title: string;
  customer: string;
  assignedTo: string;
  repairShop: string;
  status: string;
  priority: string;
  description: string;
  startDate: string;
  dueDate: string;
  estimatedCost: string;
  actualCost: string;
  jobType: string;
  notes: string;
}

export function AddJobForm() {
  const [formData, setFormData] = useState<AddJobData>({
    title: "",
    customer: "",
    assignedTo: "",
    repairShop: "",
    status: "Pending",
    priority: "Medium",
    description: "",
    startDate: "",
    dueDate: "",
    estimatedCost: "",
    actualCost: "",
    jobType: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddJobData, string>>>({});

  const handleChange = (field: keyof AddJobData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AddJobData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.customer.trim()) newErrors.customer = "Required";
    if (!formData.assignedTo.trim()) newErrors.assignedTo = "Required";
    if (!formData.repairShop.trim()) newErrors.repairShop = "Required";
    if (!formData.startDate) newErrors.startDate = "Required";
    if (!formData.dueDate) newErrors.dueDate = "Required";
    if (!formData.jobType) newErrors.jobType = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Job Form Submitted:", formData);
      alert("Job has been created successfully!");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      customer: "",
      assignedTo: "",
      repairShop: "",
      status: "Pending",
      priority: "Medium",
      description: "",
      startDate: "",
      dueDate: "",
      estimatedCost: "",
      actualCost: "",
      jobType: "",
      notes: "",
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
            title={<Typography variant="h4">Add New Job</Typography>}
            subheader={
              <Typography variant="body1" color="text.secondary">
                Fill in the details below to create a new job record
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              {/* Job Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Job Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  {/* Title */}
                  <TextField
                    label="Job Title"
                    required
                    fullWidth
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="e.g., Engine Replacement"
                  />

                  {/* Customer & Assigned To */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Customer Name"
                      required
                      fullWidth
                      value={formData.customer}
                      onChange={(e) => handleChange("customer", e.target.value)}
                      error={!!errors.customer}
                      helperText={errors.customer}
                    />
                    <TextField
                      label="Assigned To (Technician)"
                      required
                      fullWidth
                      value={formData.assignedTo}
                      onChange={(e) => handleChange("assignedTo", e.target.value)}
                      error={!!errors.assignedTo}
                      helperText={errors.assignedTo}
                    />
                  </Box>

                  {/* Repair Shop */}
                  <TextField
                    label="Repair Shop"
                    required
                    fullWidth
                    value={formData.repairShop}
                    onChange={(e) => handleChange("repairShop", e.target.value)}
                    error={!!errors.repairShop}
                    helperText={errors.repairShop}
                  />

                  {/* Job Type & Priority */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <FormControl fullWidth required error={!!errors.jobType}>
                      <InputLabel>Job Type</InputLabel>
                      <Select
                        value={formData.jobType}
                        label="Job Type"
                        onChange={(e) => handleChange("jobType", e.target.value)}
                      >
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="repair">Repair</MenuItem>
                        <MenuItem value="inspection">Inspection</MenuItem>
                        <MenuItem value="replacement">Replacement</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={formData.priority}
                        label="Priority"
                        onChange={(e) => handleChange("priority", e.target.value)}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Critical">Critical</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Dates */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      fullWidth
                      value={formData.startDate}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                    />
                    <TextField
                      label="Due Date"
                      type="date"
                      fullWidth
                      value={formData.dueDate}
                      onChange={(e) => handleChange("dueDate", e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      error={!!errors.dueDate}
                      helperText={errors.dueDate}
                    />
                  </Box>

                  {/* Status (using custom AppDropdown) */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <AppDropdown
                      value={formData.status}
                      onChange={(val) => handleChange("status", String(val))}
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "Completed", value: "Completed" },
                        { label: "Cancelled", value: "Cancelled" },
                      ]}
                    />
                  </Box>

                  {/* Cost */}
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                    <TextField
                      label="Estimated Cost"
                      type="number"
                      fullWidth
                      value={formData.estimatedCost}
                      onChange={(e) => handleChange("estimatedCost", e.target.value)}
                      placeholder="$0.00"
                    />
                    <TextField
                      label="Actual Cost"
                      type="number"
                      fullWidth
                      value={formData.actualCost}
                      onChange={(e) => handleChange("actualCost", e.target.value)}
                      placeholder="$0.00"
                    />
                  </Box>

                  {/* Description */}
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Detailed description of the job"
                  />

                  {/* Notes */}
                  <TextField
                    label="Additional Notes"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Optional notes"
                  />
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
                  Create Job
                </AppButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
