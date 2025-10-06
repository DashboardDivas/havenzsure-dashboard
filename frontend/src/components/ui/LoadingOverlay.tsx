"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Processing..." }: LoadingOverlayProps) {
  const theme = useTheme();

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary?.main || primary;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(3px)",
        zIndex: 10,
      }}
    >
      {/* Gradient Spinner */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "10px solid transparent",
          borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
          background: `conic-gradient(from 0deg, ${primary}, ${secondary}, ${primary})`,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black 0)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black 0)",
          mb: 3,
        }}
      />

      <Typography fontWeight={600} color="text.primary" variant="h6">
        {message}
      </Typography>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
}
