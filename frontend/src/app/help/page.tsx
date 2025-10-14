"use client";

import * as React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

export default function HelpPage() {
  const theme = useTheme();

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,
        transition: "background-color 0.3s ease",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
          bgcolor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          transition: "all 0.3s ease",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: theme.palette.action.hover,
              color: theme.palette.primary.main,
              transition: "all 0.3s ease",
            }}
          >
            <HelpOutlineRoundedIcon fontSize="large" />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Help is on the way ✨
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560 }}
          >
            We’re still writing this page. For now, think of this as a cozy
            placeholder. Grab a tea, pet a cat, and check back soon.
          </Typography>

          <Stack direction="row" gap={1} sx={{ mt: 1 }}>
            <Chip
              label="FAQ"
              variant="outlined"
              sx={{ color: theme.palette.text.secondary }}
            />
            <Chip
              label="Contact"
              variant="outlined"
              sx={{ color: theme.palette.text.secondary }}
            />
            <Chip
              label="Policies"
              variant="outlined"
              sx={{ color: theme.palette.text.secondary }}
            />
          </Stack>

          <Divider flexItem sx={{ my: 1, borderColor: theme.palette.divider }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button variant="contained" disableElevation color="primary">
              Back to Dashboard
            </Button>
            <Button variant="text" color="secondary">
              Go to Settings
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mt: 1, opacity: 0.8 }}
          >
            <FavoriteBorderRoundedIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary">
              v0 — placeholder only
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
