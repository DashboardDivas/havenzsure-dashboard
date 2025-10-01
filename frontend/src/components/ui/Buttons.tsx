"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function AppButton({ children, ...props }: ButtonProps) {
  const theme = useTheme();

  return (
    <Button
      {...props}
      sx={{
        borderRadius: Number(theme.shape.borderRadius) * 3,
        textTransform: "none",
        fontWeight: 600,
        px: 3,
        py: 1,
        transition: "all 0.2s ease-in-out",

        // ✅ Contained Variant (Default)
        ...(props.variant === "contained" && {
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${
            theme.palette.secondary?.main || theme.palette.primary.main
          })`,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          "&:hover": {
            background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${
              theme.palette.secondary?.dark || theme.palette.primary.dark
            })`,
            boxShadow: theme.shadows[4],
          },
          "&:active": {
            background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${
              theme.palette.secondary?.light || theme.palette.primary.light
            })`,
            boxShadow: theme.shadows[1],
            transform: "scale(0.98)",
          },
        }),

        // ✅ Outlined Variant
        ...(props.variant === "outlined" && {
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          "&:hover": {
            borderColor: theme.palette.primary.dark,
            background: theme.palette.action.hover,
          },
          "&:active": {
            borderColor: theme.palette.primary.light,
            background: theme.palette.action.selected,
          },
        }),

        // ✅ Text Variant
        ...(props.variant === "text" && {
          color: theme.palette.primary.main,
          "&:hover": {
            background: theme.palette.action.hover,
          },
          "&:active": {
            background: theme.palette.action.selected,
          },
        }),

        // ✅ Disabled State (applies to all)
        "&.Mui-disabled": {
          background:
            props.variant === "contained"
              ? theme.palette.action.disabledBackground
              : "transparent",
          color: theme.palette.action.disabled,
          borderColor: theme.palette.action.disabledBackground,
          boxShadow: "none",
        },

        ...props.sx, // allow overrides
      }}
    >
      {children}
    </Button>
  );
}
