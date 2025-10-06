"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fakeApi, type Claim } from "@/lib/fakeApi";

export default function ClaimTab() {
  const [claim, setClaim] = useState<Claim | null>(null);
  const theme = useTheme();

  useEffect(() => {
    // Fetch claim data properly using fakeApi
    const fetchData = async () => {
      const data = await fakeApi.getClaim();
      setClaim(data);
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Horizontally centers the form
        alignItems: 'flex-start', // Aligns the form at the top
        minHeight: '100vh', // Takes full viewport height
        bgcolor: theme.palette.background.default,
        p: 2, // Add some padding around the content
      }}
    >
      <Box
        sx={{
          p: 4,
          bgcolor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: 4,
          color: theme.palette.text.primary,
          maxWidth: "600px", // Limits the width of the form
          width: '100%', // Ensures it is responsive on smaller screens
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)', // Zoom effect on hover
          },
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={3}>
          Claim
        </Typography>

        {/* Insurance Claimed - checkbox */}
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Checkbox
            id="insurance-claimed"
            checked={claim?.InsuranceClaimed ?? false}
            onChange={(e) =>
              setClaim((prev) =>
                prev ? { ...prev, InsuranceClaimed: e.target.checked } : prev
              )
            }
            sx={{
              color: theme.palette.primary.main,
              "&.Mui-checked": { color: theme.palette.primary.main },
              transition: 'color 0.3s',
            }}
          />
          <Typography variant="body2" color={theme.palette.text.secondary}>
            Insurance Claimed
          </Typography>
        </Box>

        {/* Claim Approved - select yes/no */}
        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
          <InputLabel id="claim-approved-label">Claim Approved</InputLabel>
          <Select
            labelId="claim-approved-label"
            id="claim-approved"
            value={claim?.ClaimApproved ? "yes" : "no"}
            label="Claim Approved"
            onChange={(e) =>
              setClaim((prev) =>
                prev ? { ...prev, ClaimApproved: e.target.value === "yes" } : prev
              )
            }
            sx={{
              transition: 'all 0.3s ease',
              '&:focus': { borderColor: theme.palette.primary.main },
            }}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        {/* Claim - text input */}
        <TextField
          fullWidth
          size="small"
          label="Claim"
          value={claim?.Claim ?? ""}
          onChange={(e) =>
            setClaim((prev) => (prev ? { ...prev, Claim: e.target.value } : prev))
          }
          sx={{
            mb: 3,
            '& .MuiInputBase-root': {
              transition: 'all 0.3s ease',
              '&:focus': { borderColor: theme.palette.primary.main },
            },
          }}
        />

        {/* Note - textarea */}
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Note"
          size="small"
          value={claim?.Note ?? ""}
          onChange={(e) =>
            setClaim((prev) => (prev ? { ...prev, Note: e.target.value } : prev))
          }
          sx={{
            '& .MuiInputBase-root': {
              transition: 'all 0.3s ease',
              '&:focus': { borderColor: theme.palette.primary.main },
            },
          }}
        />
      </Box>
    </Box>
  );
}
