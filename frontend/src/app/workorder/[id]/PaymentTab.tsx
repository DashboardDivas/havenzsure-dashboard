"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
  useTheme,
} from "@mui/material";
import { AppButton } from "@/components/ui/Buttons";
import AppDropdown from "@/components/ui/Dropdown"; // ✅ your custom dropdown

export default function PaymentTab() {
  const theme = useTheme();
  const [note, setNote] = useState("This is the payment note.");
  const [location, setLocation] = useState<string | number>("");

  const locationOptions = [
    { label: "Unselected", value: "" },
    { label: "Calgary", value: "Calgary" },
    { label: "Vancouver", value: "Vancouver" },
  ];

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
        }}
      >
        {/* Header */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          color="primary"
        >
          Payment & Dispatch
        </Typography>

        {/* Form */}
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* Date */}
          <TextField
            fullWidth
            label="Select Date"
            type="date"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{ borderRadius: 2 }}
          />

          {/* Time */}
          <TextField
            fullWidth
            label="Select Time"
            type="time"
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{ borderRadius: 2 }}
          />

          {/* ✅ Location using AppDropdown */}
          <AppDropdown
            label="Service Location"
            value={location}
            onChange={setLocation}
            options={locationOptions}
          />

          {/* Payment Completed */}
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                sx={{
                  "&.Mui-checked": {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            }
            label="Payment Completed"
            sx={{
              color: theme.palette.text.primary,
            }}
          />

          {/* Note */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter note"
            sx={{ borderRadius: 2 }}
          />

          {/* Save Button */}
          <Box display="flex" justifyContent="flex-end" pt={2}>
            <AppButton variant="contained" color="primary">
              Save Payment
            </AppButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
