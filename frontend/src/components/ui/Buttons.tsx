"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function AppButton({
  children,
  gradient,
  ...props
}: ButtonProps & { gradient?: string }) {
  const theme = useTheme();

  // 🧠 Determine which color to use (supports "error", "success", etc.)
  const colorKey = props.color || "primary";

  const validColorKeys = [
    "primary",
    "secondary",
    "success",
    "error",
    "warning",
    "info",
  ] as const;
  type ValidColorKey = (typeof validColorKeys)[number];

  const isValidColorKey = (key: string): key is ValidColorKey =>
    validColorKeys.includes(key as ValidColorKey);

  // ✅ Safe palette access
  const palette = isValidColorKey(colorKey)
    ? theme.palette[colorKey]
    : theme.palette.primary;

  const main = palette.main || theme.palette.primary.main;
  const dark = palette.dark || main;
  const light = palette.light || main;

  // ✅ Optional custom gradient support
  const background =
    props.variant === "contained"
      ? gradient
        ? `linear-gradient(90deg, ${gradient})`
        : `linear-gradient(90deg, ${main}, ${dark})`
      : "transparent";

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

        // ✅ Contained variant
        ...(props.variant === "contained" && {
          background,
          color: theme.palette.getContrastText(main),
          "&:hover": {
            background: gradient
              ? `linear-gradient(90deg, ${gradient})`
              : `linear-gradient(90deg, ${dark}, ${main})`,
            boxShadow: theme.shadows[4],
          },
          "&:active": {
            background: gradient
              ? `linear-gradient(90deg, ${gradient})`
              : `linear-gradient(90deg, ${light}, ${main})`,
            boxShadow: theme.shadows[1],
            transform: "scale(0.98)",
          },
        }),

        // ✅ Outlined variant
        ...(props.variant === "outlined" && {
          borderColor: main,
          color: main,
          "&:hover": {
            borderColor: dark,
            background: theme.palette.action.hover,
          },
          "&:active": {
            borderColor: light,
            background: theme.palette.action.selected,
          },
        }),

        // ✅ Text variant
        ...(props.variant === "text" && {
          color: main,
          "&:hover": {
            background: theme.palette.action.hover,
          },
          "&:active": {
            background: theme.palette.action.selected,
          },
        }),

        // ✅ Disabled state
        "&.Mui-disabled": {
          background:
            props.variant === "contained"
              ? theme.palette.action.disabledBackground
              : "transparent",
          color: theme.palette.action.disabled,
          borderColor: theme.palette.action.disabledBackground,
          boxShadow: "none",
        },

        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
}
